type JwtTokenPayload = {
    sub: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
};

export default JwtTokenPayload;
