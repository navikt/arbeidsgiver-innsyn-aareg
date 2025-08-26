module.exports = {
    mock: (app) => {
        app.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/organisasjoner', (req, res) => {
            res.send([
                {
                    name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '910825550',
                    organizationNumber: '910825569',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'ULNES OG SÆBØ',
                    type: 'Business',
                    parentOrganizationNumber: '910712217',
                    organizationNumber: '910712241',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'TRANØY OG SANDE I VESTFOLD REGNSKAP',
                    type: 'Enterprise',
                    parentOrganizationNumber: null,
                    organizationNumber: '910825550',
                    organizationForm: 'AS',
                    status: 'Active',
                },
                {
                    name: 'BYGSTAD OG VINTERBRO REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '910825321',
                    organizationNumber: '910825348',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'LINESØYA OG LANGANGEN REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '910825550',
                    organizationNumber: '910825585',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'SLEMMESTAD OG STAVERN REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '910825496',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'STØ OG BERGER',
                    type: 'Enterprise',
                    parentOrganizationNumber: null,
                    organizationNumber: '910712217',
                    organizationForm: 'AS',
                    status: 'Active',
                },
                {
                    name: 'UTVIK OG ETNE',
                    type: 'Business',
                    parentOrganizationNumber: '910712217',
                    organizationNumber: '910712233',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'LALM OG NARVIK REVISJON',
                    type: 'Enterprise',
                    parentOrganizationNumber: null,
                    organizationNumber: '911003155',
                    organizationForm: 'AS',
                    status: 'Active',
                },
                {
                    name: 'MALMEFJORDEN OG RIDABU REGNSKAP',
                    type: 'Enterprise',
                    parentOrganizationNumber: null,
                    organizationNumber: '810825472',
                    organizationForm: 'AS',
                    status: 'Active',
                },
                {
                    name: 'ENEBAKK OG ØYER',
                    type: 'Business',
                    parentOrganizationNumber: '910712217',
                    organizationNumber: '910712268',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'BIRTAVARRE OG VÆRLANDET REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '910825550',
                    organizationNumber: '910825607',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'MAURA OG KOLBU REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '910825518',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'GAMLE FREDRIKSTAD OG RAMNES REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '910825526',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
            ]);
        });
        app.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/rettigheter-til-tjeneste/', (req, res) => {
            if (req.query.serviceKode !== '5441' && req.query.serviceEdition !== '1') {
                res.send([]);
                return;
            }
            res.send([
                {
                    name: 'UTVIK OG ETNE',
                    type: 'Business',
                    parentOrganizationNumber: '910712217',
                    organizationNumber: '910712233',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'MALMEFJORDEN OG RIDABU REGNSKAP',
                    type: 'Enterprise',
                    parentOrganizationNumber: null,
                    organizationNumber: '810825472',
                    organizationForm: 'AS',
                    status: 'Active',
                },
                {
                    name: 'MAURA OG KOLBU REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '910825518',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'GAMLE FREDRIKSTAD OG RAMNES REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '810825472',
                    organizationNumber: '910825526',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'BIRTAVARRE OG VÆRLANDET REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '910825550',
                    organizationNumber: '910825607',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
                {
                    name: 'STORFOSNA OG FREDRIKSTAD REGNSKAP',
                    type: 'Business',
                    parentOrganizationNumber: '910825550',
                    organizationNumber: '910825569',
                    organizationForm: 'BEDR',
                    status: 'Active',
                },
            ]);
        });
    }
}