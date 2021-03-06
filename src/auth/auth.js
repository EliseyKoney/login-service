import passport from 'passport';
import passportLocal from 'passport-local'
import passportJwt from 'passport-jwt';

import { UserModel } from '../model/model.js'

const ExtractJWT = passportJwt.ExtractJwt
const JWTstrategy = passportJwt.Strategy
const localStrategy = passportLocal.Strategy

passport.use(
	new JWTstrategy(
		{
			secretOrKey: 'TOP_SECRET',
			jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.create({ email, password });
				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.findOne({ email });

				if (!user) {
					return done(null, false, { message: 'User not found' });
				}

				const validate = await user.isValidPassword(password);

				if (!validate) {
					return done(null, false, { message: 'Wrong Password' });
				}

				return done(null, user, { message: 'Logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);