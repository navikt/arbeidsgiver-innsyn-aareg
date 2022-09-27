import {Issuer} from 'openid-client';

export const exchangeToken = async (tokenxClient, {subject_token, audience}) => {
    return await tokenxClient.grant(
        {
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
            audience,
            subject_token,
        },
        {
            clientAssertionPayload: {
                nbf: Math.floor(Date.now() / 1000),
            },
        }
    );
};

export const createTokenXClient = async (config = {
    discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
    clientID: process.env.TOKEN_X_CLIENT_ID,
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
}) => {
    const issuer = await Issuer.discover(config.discoveryUrl);
    return new issuer.Client(
        {
            client_id: config.clientID,
            token_endpoint_auth_method: 'private_key_jwt',
        },
        {keys: [JSON.parse(config.privateJwk)]}
    );
};

export const tokenXMiddleware = (
    {
        tokenxClientPromise,
        audience,
        log
    }
) => async (req, res, next) => {
    try {
        if (!audience) {
            next();
            return;
        }

        const subject_token = (req.headers['authorization'] || '').replace('Bearer', '').trim();
        if (subject_token === '') {
            next();
            return;
        }
        const accessToken = await exchangeToken(await tokenxClientPromise, {
            subject_token,
            audience
        });
        req.setHeader('authorization', `Bearer ${accessToken}`);
        next();
    } catch (error) {
        log.error(`Token exchange failed with error: ${error}`);
        next(error);
    }
};

export const validateIdportenJwtMiddleware = (req, res, next) => {
    // TODO: validate token
    // https://github.com/navikt/dp-auth/blob/674fac682d40d1a7a527704d2a413b5ee51aa473/lib/providers/idporten.ts#L23
    next();
};