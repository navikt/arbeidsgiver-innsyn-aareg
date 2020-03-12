const proxy = require('http-proxy-middleware');

const envPropertiesArbeidsforholdApi = {
    API_GATEWAY: process.env.APIGW_URL || 'http://localhost:8080',
    APIGW_HEADER: process.env.ARBEIDSFORHOLD_API_GW_HEADER
};

const proxyConfigArbeidsforholdApi = {
    changeOrigin: true,
    target: envPropertiesArbeidsforholdApi.API_GATEWAY,
    pathRewrite: {
        '^/arbeidsgiver-arbeidsforhold/api': '/arbeidsgiver-arbeidsforhold-api'
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

module.exports = proxy(proxyConfigArbeidsforholdApi);
