export const hentArbeidsforholdLink = (orgnr: string) => {
    return (
        'https://arbeidsgiver.nais.preprod.local/ditt-nav-arbeidsgiver-api/api/arbeidsforhold/' +
        orgnr
    );
};