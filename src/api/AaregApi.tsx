import {hentArbeidsforholdLink} from "../App/lenker";

export async function hentArbeidsforholdFraAAreg(orgnr: string): Promise<any> {
    let respons = await fetch(hentArbeidsforholdLink(orgnr));
    if (respons.ok) {
        return await respons.json();
    }else {
        return null;
    };
};