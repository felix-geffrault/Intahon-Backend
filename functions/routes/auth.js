const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/login", (req, res, next) => {
	passport.authenticate("login", function (err, user, info) {
		if (err) {
			return res.status(400).json({ errors: err });
		}
		if (!user) {
			return res.status(400).json({ errors: info.message });
		}
		req.logIn(user, function (err) {
			if (err) return res.status(400).json({ errors: err });
			return res.status(200).json({ success: `Logged in ${user.id}`, token: user.token });
		});
	})(req, res, next);
});

router.post("/register", (req, res, next) => {
	passport.authenticate("register", (err, user, info) => {
		if (err) return res.status(400).json({ errors: err });
		if (!user) return res.status(400).json({ errors: info.message });
		req.logIn(user, (err) => {
			if (err) return res.status(400).json({ errors: err });
			return res.status(200).json({ success: `Registered with ${user.id}`, token: user.token });
		});
	})(req, res, next);
});

module.exports = router;
