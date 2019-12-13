import {hentArbeidsforholdLink} from "../App/lenker";
import {ObjektFraAAregisteret, tomResponsFraAareg} from "../App/Objekter/ObjektFraAAreg";

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    console.log ("hentArbeidsforholdFraAAreg orgnr",underenhet);
    console.log ("hentArbeidsforholdFraAAreg jurenhet",enhet);
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    let respons = await fetch(hentArbeidsforholdLink(), {headers:headere});
    if (respons.ok) {
        return await respons.json();
    }else {
        return tomResponsFraAareg;
    };
};
