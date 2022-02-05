const mongoose = require("mongoose");

const ThirdPartyProviderSchema = new mongoose.Schema({
	provider_name: {
		type: String,
		default: null,
	},
	provider_id: {
		type: String,
		default: null,
	},
	provider_data: {
		type: {},
		default: null,
	},
});

// Create Schema
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		email_is_verified: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
		},
		third_party_auth: [ThirdPartyProviderSchema],
		token: {
			type: String,
			default: require("crypto").randomBytes(48).toString("hex"),
		},
		objects: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Object",
			},
		],
	},
	{ strict: false, timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
