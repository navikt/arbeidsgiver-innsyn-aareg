const proxy = require('http-proxy-middleware');

const envPropertiesArbeidsforholdApi = {
    API_GATEWAY: process.env.API_GATEWAY || 'http://localhost:8080',
    APIGW_HEADER: process.env.ARBEIDSFORHOLD_API_GW_HEADER
};

const proxyConfigArbeidsforholdApi = {
    changeOrigin: true,
    target: envPropertiesArbeidsforholdApi.API_GATEWAY,
    pathRewrite: {
        '^/arbeidsforhold/arbeidsgiver-arbeidsforhold/api': '/arbeidsgiver-arbeidsforhold-api'
    },
    secure: true,
    xfwd: true
};

if (envPropertiesArbeidsforholdApi.APIGW_HEADER) {
    console.log(" gw header-kallt, APIGW er definert")
    proxyConfigArbeidsforholdApi.headers = {
        'x-nav-apiKey': envPropertiesArbeidsforholdApi.APIGW_HEADER
    };
}
else {
    console.log('Arbeidsgiver-arbeidsforhold klarte ikke hente API-key')
}

console.log('Arbeidsgiver-arbeidsforholdproxy config brukt')


module.exports = proxy(proxyConfigArbeidsforholdApi);
