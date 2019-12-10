
const proxy = require('http-proxy-middleware');

const enkeltArbeidsforhold = () => {
    if (process.env.NAIS_CLUSTER_NAME === "prod-sbs") {
        return "https://www.nav.no";
    } else {
        return "https://www-q0.nav.no";
    }
};

const enkeltArbeidsforholdProxyConfig = {
    changeOrigin: true,
    target: enkeltArbeidsforhold(),
    pathRewrite: {
        '^/bedriftsoversikt-og-ansatte': '',
    },
    secure: true,
    xfwd: true
};

module.exports = proxy(enkeltArbeidsforholdProxyConfig);