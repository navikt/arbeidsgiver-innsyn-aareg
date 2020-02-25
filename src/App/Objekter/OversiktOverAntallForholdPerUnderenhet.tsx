export type OversiktOverAntallForholdPerUnderenhet = overSiktPerUnderenhet[];
export type overSiktPerUnderenhet = {
    arbeidsgiver: {
        type: string
    }
    aktiveArbeidsforhold: number
    inaktiveArbeidsforhold: number
}