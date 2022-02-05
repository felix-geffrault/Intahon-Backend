var express = require("express");
const User = require("../models/User");
const Object = require("../models/Object");
var router = express.Router();

/* GET users listing. */
router.get("/objects", async function (req, res, next) {
	if (!req.user) {
		return res.status(401).json({ error: "You must be connected to access object list." });
	}
	const user = await req.user.populate("objects");
	return res.status(200).json(
		user.objects.map((o) => ({
			_id: o.id,
			name: o.name,
			address_ip: o.address_ip,
		}))
	);
});


module.exports = router;
