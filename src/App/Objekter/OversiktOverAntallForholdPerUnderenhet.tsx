export type OversiktOverAntallForholdPerUnderenhet = overSiktPerUnderenhet[];
export type overSiktPerUnderenhet = {
    arbeidsgiver: {
        type: string;
        organisasjonsnummer: string;
    };
    aktiveArbeidsforhold: number;
    inaktiveArbeidsforhold: number;
};

export type overSiktPerUnderenhetPar = {
    first: string;
    second: number;
};
