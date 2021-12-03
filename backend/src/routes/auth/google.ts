import express from 'express';

import * as controller from '../../controllers/auth/google';
import { createToken } from '../../controllers/auth/token';
import { createUserMiddleware } from '../../controllers/userMiddleware';

export const router = express.Router();

router.get('/', controller.redirectUrl(), controller.redirectToAuthUrl());

router.get(
    '/callback',
    controller.verifyCode(),
    controller.unpackPayload(),
    createUserMiddleware(),
    createToken(),
    controller.handleAuthCallback()
);
