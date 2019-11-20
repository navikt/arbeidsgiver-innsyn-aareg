import {hentArbeidsforholdLink} from "../lenker";

export async function hentArbeidsforhold(orgnr: string): Promise<any> {
    let respons = await fetch(hentArbeidsforholdLink(orgnr));
    if (respons.ok) {
        return await respons.json();
    } else {
        return null;
    }
}