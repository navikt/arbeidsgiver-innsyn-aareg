import fetchMock from "fetch-mock";

fetchMock
    .get(url =>
        new URL(url).hostname === 'amplitude.nav.no'
        ,
        200
    )
    .spy();
