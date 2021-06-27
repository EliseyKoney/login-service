import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

UserSchema.pre(
	'save',
	async function (next) {
		const user = this;
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
		next();
	}
);

UserSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);
	return compare;
}

export const UserModel = model('user', UserSchema);

