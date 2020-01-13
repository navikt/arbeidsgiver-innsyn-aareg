import {Arbeidsforhold} from "../App/Objekter/ArbeidsForhold";
import {ObjektFraAAregisteret, tomResponsFraAareg} from "../App/Objekter/ObjektFraAAreg";

export const listeMedFornavn: string[]= ["Ingrid Alexandra", "Håkon", "Mette Marit", "Harald", "Sonja", "Olav","Lars Andreas", "Bendik", "Thomas", "Hanna", "Silje", "Anders", "Vera", "Jonathan", "Lilly", "Helene", "Tobias", "Gabriel", "Henriette", "Trude", "Gudrun", "Elina", "Kaia", "Knut", "Jenny", "Petter", "Martin", "Marie", "Herman", "Alfred", "Leif", "Inger", "Ivar", "Trond"];

export const listeMedEtterNavn: string[] = ["Murphy", "Behn", "Lengali", "Pedersen", "Blåklokke", "Rivehjern", "Olavsson", "Hammerseng", "Northug", "Rishovd", "Knutsen", "Ludvigsen", "Solberg", "Stoltenberg", "Støre", "Ibsen", "Munch", "Vang", "Nesbø", "Morgenstierne"];

export const datoer: string[] = ["1996-01-29", "1999-04-01", "1998-12-01", "1990-04-18", "1990-02-14", "1980-05-01", "2000-05-17", "1814-05-17","2020-04-29", "2021-08-13", "2024-12-17", "2020-01-28", "2021-02-15", "2025-05-01", "2020-12-24", "2020-03-03"];

export const yrker: string[] = ["Systemutvikler", "Interasksjonsdesigner", "Sjåfør", "Togfører", "Billettkontrollør", "Kokk", "Au pair", "Tannlege", "Kirurg", "Psykolog", "Psykiater", "Redaktør", "Journalist", "Skribent", "Forfatter", "Ekspeditør", "Prsonalansvarlig", "Daglig leder", "Servitør", "Pianist", "Lektor", "Gymlærer", "Konsulent", "Produkteier", "Generalsekretær", "Arkitekt", "Slangetemmer", "Performer", "Torpedo"];

export const fodselsNr: string []= ["04015226825","15119702590","30067234940","22059007517","14039717019","08020285185","20106012971","20085624661","08024706711","26075014618","14117227856","03045013986","08114503186","19105737176","05037702090","14077541803","07106728814","28079345867","28077403517","23097011680","14109431703","03049219872","09037947773","21038137589","17123920384","06047414707","21123832989"];

export const varlingskoder: string[] = ["ERKONK", "EROPPH", "ERVIRK", "IBARBG","IBKAOR"];

const tomtArbeidsForhold: Arbeidsforhold = {
  ansattFom: '',
  ansattTom: '',
  arbeidsgiver: {
    type: '',
  },
  arbeidstaker: {
    type: '',
    aktoerId: '',
    offentligIdent: '',
    navn: '',
  },
  innrapportertEtterAOrdningen: '',
  navArbeidsforholdId: '',
  opplysningspliktig: {
    type: '',
  },
  permisjonPermitteringsprosent: '',
  sistBekreftet: '',
  stillingsprosent: '',
  type: '',
  varslingskode: '',
  yrke: '',
};

const genererRandomIndex = (lengde: number): number => {
  let tilfeldigIndeks = Math.random();
  tilfeldigIndeks = tilfeldigIndeks * lengde;
  return Math.floor(tilfeldigIndeks);
};

const setNavn = (): string => {
  const indeksFornavn =genererRandomIndex(listeMedFornavn.length);
  const indeksEtternavn = genererRandomIndex(listeMedEtterNavn.length)
  return(listeMedFornavn[indeksFornavn] + " " + listeMedEtterNavn[indeksEtternavn]);
};

const setTom = (datoFom: string): string => {
  let indeks = genererRandomIndex(datoer.length);
  let datoTom: string = datoer[indeks];
  while (new Date(datoTom) < new Date(datoFom)){
   indeks = genererRandomIndex(datoer.length);
   datoTom = datoer[indeks];
  }
  const nyDatoTom = datoTom;
  return nyDatoTom;

};

const setFom = (): string => {
  const indeks = genererRandomIndex(datoer.length);
  return datoer[indeks];
};

const setYrke = (): string => {
  const indeks = genererRandomIndex(yrker.length);
  return yrker[indeks];

};

const setFnr = (): string => {
  const indeks = genererRandomIndex(fodselsNr.length);
  return fodselsNr[indeks];

};

const setVarslingskode = (): string => {
  const indeks = genererRandomIndex(varlingskoder.length);
  return varlingskoder[indeks];

};

const lagAnsattForhold = (): Arbeidsforhold => {
  const fomDato:string = setFom();
  const tomDato: string = setTom(fomDato);
  return {
    ...tomtArbeidsForhold,
    ansattFom: fomDato,
    ansattTom: tomDato,
    yrke:setYrke(),
    varslingskode: setVarslingskode(),
    arbeidstaker: {
        ...tomtArbeidsForhold.arbeidstaker,
      offentligIdent: setFnr(),
      navn: setNavn()
    }
  };
};

const genererMockingAvArbeidsForhold = (antall: number): Arbeidsforhold[] => {
  const listeMedArbeidsForhold: Arbeidsforhold[] = [];
  for (let i: number = 0; i < antall;  i++) {
    listeMedArbeidsForhold.push(lagAnsattForhold());
  }

  return listeMedArbeidsForhold.map( forhold => {
    return {...forhold,
      navArbeidsforholdId: listeMedArbeidsForhold.indexOf(forhold).toString()
    }
  });
};

export const AaregMockObjekt: ObjektFraAAregisteret =  {...tomResponsFraAareg,
    arbeidsforholdoversikter: genererMockingAvArbeidsForhold(1000)
};
