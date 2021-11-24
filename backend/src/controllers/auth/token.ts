import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from 'google-auth-library';
import jwt, { JwtPayload } from 'jsonwebtoken';

import jwtTokenPayload from '../../types/jwtTokenPayload';

const jwtSecret = process.env.JWT_SECRET as string;

/**
 * Creates a JWT token containing user data and access tokens
 * @returns
 */
export const createToken = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const payload = res.locals.payload as TokenPayload | undefined;

            const jwtPayload: jwtTokenPayload = {
                sub: payload?.sub as string,
                name: payload?.name as string,
                email: payload?.email as string,
                accessToken: res.locals.accessToken,
                refreshToken: res.locals.refreshToken
            };

            res.locals.token = writeToken(jwtPayload);
            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Updates access token
 * @param jwtToken
 * @param newAccessToken
 * @returns JWT token
 */
export const updateToken = (
    jwtToken: string,
    newAccessToken: string
): string => {
    try {
        const payload = readToken(jwtToken);
        payload.accessToken = newAccessToken;
        return writeToken(payload);
    } catch (err) {
        throw new Error('Could not decode token');
    }
};

/**
 * Reads token and returns the object
 * This might be unnecessary but didn't get this to work otherwise
 * @param token JWT token
 * @returns Token payload
 */
export const readToken = (token: string): jwtTokenPayload => {
    const payload = jwt.verify(token, jwtSecret, {
        issuer: process.env.HOSTED_DOMAIN
    }) as JwtPayload;

    return {
        sub: payload.sub as string,
        name: payload.name,
        email: payload.email,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken
    };
};

/**
 * Writes a new JWT token
 * @param payload Payload to write
 * @returns JWT token
 */
export const writeToken = (payload: jwtTokenPayload): string => {
    const token = jwt.sign(payload, jwtSecret, {
        issuer: process.env.HOSTED_DOMAIN,
        expiresIn: '365 days'
    });

    return token;
};
