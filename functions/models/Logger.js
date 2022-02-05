const mongoose = require("mongoose");

// Create Schema
const LoggerSchema = new mongoose.Schema(
	{
		Object: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Object",
		},
		User: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Object",
		},
		message: {
			type: String,
		},
		start_time: {
			type: Date,
		},
		duration: {
			type: Number,
		},
	},
	{ strict: false }
);

module.exports = Logger = mongoose.model("Logger", LoggerSchema);
