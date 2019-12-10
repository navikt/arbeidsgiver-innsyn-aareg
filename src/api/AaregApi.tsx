import {hentArbeidsforholdLink} from "../App/lenker";
import {ObjektFraAAregisteret, tomResponsFraAareg} from "../App/Objekter/ObjektFraAAreg";
import {VeilStatus} from "./veilarbApi";

export async function hentArbeidsforholdFraAAreg(underenhet: string, enhet: string): Promise<ObjektFraAAregisteret> {
    const headere = new Headers();
    headere.set('orgnr', underenhet);
    headere.set('jurenhet', enhet);
    let respons = await fetch(hentArbeidsforholdLink(), {headers:headere});
    if (respons.ok) {
        return await respons.json();
    }else {
        return tomResponsFraAareg;
    };
};

export async function hentEnkeltArbeidsforholdFraAAreg() {
    const headere = new Headers();
    headere.set("Content-Type", "application/json;charset=UTF-8");
    headere.set('Fnr-Arbeidstaker', "27127424204");
    const respons = await fetch('/bedriftsoversikt-og-ansatte/person/arbeidsforhold-api/arbeidsforholdinnslag/arbeidsgiver/47720602', {
        method: 'GET',
        credentials: 'include',
        headers:headere
    });
    if (respons.ok) {
        console.log(respons.json());
    }
};
