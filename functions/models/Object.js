const mongoose = require("mongoose");

// Create Schema
const ObjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		address_mac: {
			type: String,
			required: true,
			unique: true,
		},
		address_ip: {
			type: String,
		},
		client_token: {
			type: String,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ strict: false }
);

module.exports = CObject = mongoose.model("Object", ObjectSchema);
