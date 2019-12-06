import {hentArbeidsforholdLink} from "../App/lenker";

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<any> {
    const headere = new Headers();
    headere.append('org-nr', underenhet);
    headere.append('jurenhet', enhet);
    let respons = await fetch(hentArbeidsforholdLink(), {headers:headere});
    if (respons.ok) {
        return await respons.json();
    }else {
        return null;
    };
};