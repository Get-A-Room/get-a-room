import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import 'dotenv/config';

export const router = express.Router();

const backendUrl = process.env.CALLBACK_URL || 'http://localhost:8080';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: `${backendUrl}/auth/google/callback`
        },
        function (accessToken, refreshToken, profile, done) {
            let email = null;

            if (profile.emails && profile.emails[0]) {
                email = profile.emails[0].value;
            }

            if (profile._json.hd !== 'oispahuone.com') {
                return done(null);
            }

            const user = {
                googleId: profile.id,
                email,
                displayName: profile.displayName,
                token: accessToken
            };

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return done(null);
            }

            return done(null, jwt.sign(user, jwtSecret, { expiresIn: '60m' }));
        }
    )
);

// TODO: Add support for custom address after the callback

router.get(
    '/',
    passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly'
        ],
        session: false
    })
);

router.get(
    '/callback',
    passport.authenticate('google', {
        failureRedirect: `${frontendUrl}/auth/failure`,
        session: false
    }),
    function (req, res) {
        res.redirect(`${frontendUrl}/auth/success?token=${req.user}`);
    }
);
