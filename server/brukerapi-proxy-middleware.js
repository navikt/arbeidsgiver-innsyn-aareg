import {Issuer} from 'openid-client';
import expressHttpProxy from 'express-http-proxy';

const {
    NAIS_CLUSTER_NAME = 'local',
    TOKEN_X_WELL_KNOWN_URL,
    TOKEN_X_CLIENT_ID,
    TOKEN_X_PRIVATE_JWK
} = process.env;

if (NAIS_CLUSTER_NAME === 'local' || NAIS_CLUSTER_NAME === 'labs-gcp') {
    import("@navikt/arbeidsgiver-notifikasjoner-brukerapi-mock")
}

const config = () => {
    if (NAIS_CLUSTER_NAME === 'local' || NAIS_CLUSTER_NAME === 'labs-gcp') {
        return {
            target: 'http://localhost:8081',
            tokenXClientPromise: Promise.resolve({
                grant: () => ({access_token: "foo"}),
                issuer: {metadata: {token_endpoint: ''}}
            }),
        }
    } else {
        return {
            target: 'http://notifikasjon-bruker-api.fager.svc.cluster.local',
            tokenXClientPromise: createTokenXClient(),
        }
    }
}

const createTokenXClient = async () => {
    const issuer = await Issuer.discover(TOKEN_X_WELL_KNOWN_URL);
    return new issuer.Client(
        {
            client_id: TOKEN_X_CLIENT_ID,
            token_endpoint_auth_method: 'private_key_jwt',
        },
        {keys: [JSON.parse(TOKEN_X_PRIVATE_JWK)]}
    );
};

export const createNotifikasjonBrukerApiProxyMiddleware = () => {
    const {target, tokenXClientPromise} = config()
    const audience = `${NAIS_CLUSTER_NAME}:fager:notifikasjon-bruker-api`;
    return expressHttpProxy(target, {
        proxyReqPathResolver: () => '/api/graphql',
        proxyReqOptDecorator: async (options, req) => {
            const tokenXClient = await tokenXClientPromise;
            const subject_token = req.cookies['selvbetjening-idtoken'];
            const {access_token} = await exchangeToken(tokenXClient, {subject_token, audience});

            options.headers.Authorization = `Bearer ${access_token}`;
            return options;
        },
    });
}

const exchangeToken = async (tokenxClient, {subject_token, audience}) => {
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