const CObject = require("../models/Object");
const User = require("../models/User");
const Logger = require("../models/Logger");
const express = require("express");
const router = express.Router();

router.post("/connexion", async (req, res, next) => {
	const body = await req.body;
	const ipAddr = body.address_ip + ":" + body.port;
	const user = await User.findOne({ token: body.client_token });
	if (!user) {
		res.status(400).json({ error: "Invalid client token" });
		return;
	}
	let object = await CObject.findOne({ address_mac: body.address_mac });
	let created = false;
	if (!object) {
		object = new CObject({ address_mac: body.address_mac, address_ip: ipAddr, client_token: body.client_token, user: user });
		object.save().catch((err) => {
			res.status(400).json({ error: err });
		});
		created = true;
	} else {
		object.user = user;
		object.address_ip = ipAddr;
		object.client_token = body.client_token;
		object.save().catch((err) => {
			res.status(400).json({ error: err });
		});
	}
	if (!user.objects.includes(object._id)) user.objects.push(object);
	user.save()
		.then(() => {
			res.status(created ? 201 : 200).json({ success: `Object Successfully ${created ? "created" : "updated"}.` });
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
});

router.post("/logging", async (req, res, next) => {
	const body = await req.body;
	const object = await CObject.findOne({ address_mac: body.address_mac }).catch((err) => {
		res.status(400).json({ error: err });
	});
	if (!object) {
		res.status(400).json({ error: "Invalid Mac Address" });
		return;
	}
	const user = await User.findOne({ token: body.client_token }).catch((err) => {
		res.status(400).json({ error: err });
	});
	if (!user) {
		res.status(400).json({ error: "Invalid Client Token" });
		return;
	}
	const duration = body.duration;
	const end_time = Date.now();
	const start_time = new Date(end_time - duration);
	const logger = new Logger({ User: user, Object: object, start_time: start_time, duration: Math.floor(duration / 1_000_000) });
	logger
		.save()
		.then(() => {
			res.status(201).json({ sucess: "Logged saved" });
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
});

router.post("/logs", async (req, res, next) => {
	const body = req.body;
	const object = await CObject.findOne({ user: req.user, _id: body.object_id }).catch((err) => {
		res.status(400).json({ error: err });
	});
	if (!object) {
		res.status(400).json({ error: "User / Object don't match." });
		return;
	}
	const logs = await Logger.find({ Object: object })
		.select("start_time duration")
		.catch((err) => {
			res.status(400).json({ error: err });
		});
	if (logs) res.status(200).json(logs);
});

router.post("/rename", async (req, res, next) => {
	const body = await req.body;
	if(!body.object_id){
		return res.status(400).json({error: '"object_id" is not precised}'});
	}
	if(!req.user){
		return res.status(400).json({error: "You must be logged to "})
	}
	const object = await CObject.findOne({ user: req.user, _id: body.object_id }).catch((err) => {
		res.status(400).json({ error: err });
	});
	if (!object) {
		res.status(400).json({ error: "User / Object don't match." });
		return;
	}
	object.name = body.name;
	object
		.save()
		.then(() => {
			res.status(200).json({ sucess: "Name changed." });
		})
		.catch((err) => {
			res.status(400).json({ error: err });
		});
});

module.exports = router;
