const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

// Local Strategy
passport.use(
	"login",
	new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		// Match User
		User.findOne({ email: email })
			.then((user) => {
				// Match password
				if (!user) return done(null, false, { message: "Invalid credential" });
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						return done(null, user);
					} else return done(null, false, { message: "Invalid credential" });
				});
			})
			.catch((err) => done(null, false, { message: err }));
	})
);

passport.use(
	"register",
	new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
		User.findOne({ email: email }).then((user) => {
			if (user) return done(null, false, { message: "Email already Used" });
			if (!/^\S+@\S+\.\S+$/.test(email)) return done(null, false, { message: "Email invalid" });
			if (password.length < 6) return done(null, false, { message: "Password too short" });
			const newUser = new User({ email, password });
			// Hash password before saving in database
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then((user) => {
							return done(null, user);
						})
						.catch((err) => {
							return done(null, false, { message: err });
						});
				});
			});
		});
	})
);

module.exports = passport;
