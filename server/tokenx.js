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
                // TokenX only allows a single audience
                aud: [tokenxClient?.issuer.metadata.token_endpoint],
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

export const authorizationBearerSubjectTokenExtractor = (req) => (req.headers.authorization || '').replace('Bearer', '').trim();
export const loginserviceCookieSubjectTokenExtractor = (req) => req.cookies['selvbetjening-idtoken'];

export const tokenXMiddleware = (
    {
        tokenxClientPromise,
        audience,
        subjectTokenExtractor,
        log
    }
) => async (req, res, next) => {
    try {
        if (!audience) {
            next();
            return;
        }

        const subject_token = subjectTokenExtractor(req);
        if (subject_token === '') {
            log.info("no authorization header found, skipping tokenx.")
            next();
            return;
        }
        const {access_token} = await exchangeToken(await tokenxClientPromise, {
            subject_token,
            audience
        });
        req.headers.authorization = `Bearer ${access_token}`;
        log.info("tokenx completed. authorization header is set.")
        next();
    } catch (error) {
        log.error(`Token exchange failed with error: ${error}`);
        next(error);
    }
};