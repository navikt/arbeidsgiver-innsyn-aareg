import {Arbeidsforhold} from "../App/Objekter/ArbeidsForhold";

export const listeMedFornavn: string[]= ["Ingrid Alexandra", "Håkon", "Mette Marit", "Harald", "Sonja", "Olav","Lars Andreas", "Bendik", "Thomas", "Hanna", "Silje", "Anders", "Vera", "Jonathan", "Lilly", "Helene", "Tobias", "Gabriel", "Henriette", "Trude", "Gudrun", "Elina", "Kaia", "Knut", "Jenny", "Petter", "Martin", "Marie", "Herman", "Alfred", "Leif", "Inger", "Ivar", "Trond"];

export const listeMedEtterNavn: string[] = ["Murphy", "Behn", "Lengali", "Pedersen", "Blåklokke", "Rivehjern", "Olavsson", "Hammerseng", "Northug", "Rishovd", "Knutsen", "Ludvigsen", "Solberg", "Stoltenberg", "Støre", "Ibsen", "Munch", "Vang", "Nesbø", "Morgenstierne"];

export const datoFortid: string[] = ["29/01/1996", "01/04/1999", "01/12/1998", "18/04/1990", "14/02/1990", "01/05/1980", "17/05/2000", "17/05/1814"];

export const datoFramtid: string[] = ["29/01/2020", "01/04/2021", "01/12/2024", "18/04/2020", "14/02/2021", "01/05/2025", "17/05/2020", "17/05/2020"];

export const yrker: string[] = ["Systemutvikler", "Interasksjonsdesigner", "Sjåfør", "Togfører", "Billettkontrollør", "Kokk", "Au pair", "Tannlege", "Kirurg", "Psykolog", "Psykiater", "Redaktør", "Journalist", "Skribent", "Forfatter", "Ekspeditør", "Prsonalansvarlig", "Daglig leder", "Servitør", "Pianist", "Lektor", "Gymlærer", "Konsulent", "Produkteier", "Generalsekretær", "Arkitekt", "Slangetemmer", "Performer", "Torpedo"];

export const fodselsNr: string []= ["04015226825","15119702590","30067234940","22059007517","14039717019","08020285185","20106012971","20085624661","08024706711","26075014618","14117227856","03045013986","08114503186","19105737176","05037702090","14077541803","07106728814","28079345867","28077403517","23097011680","14109431703","03049219872","09037947773","21038137589","17123920384","06047414707","21123832989"];

export const varlingskoder: string[] = ["ERKONK", "EROPPH", "ERVIRK", "IBARBG","IBKAOR"];

const tomtArbeidsForhold: Arbeidsforhold = { navn: '',
  ansattFom: '',
  ansattTom: '',
  arbeidsgiver: {
    type: '',
  },
  arbeidstaker: {
    type: '',
    aktoerId: '',
    offentligIdent: '',
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

const setTom = (): string => {
  const indeks = genererRandomIndex(datoFramtid.length);
  return datoFramtid[indeks];
};

const setFom = (): string => {
  const indeks = genererRandomIndex(datoFortid.length);
  return datoFortid[indeks];
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
  return {
    ...tomtArbeidsForhold,
    navn: setNavn(),
    ansattTom: setTom(),
    ansattFom: setFom(),
    yrke:setYrke(),
    varslingskode: setVarslingskode(),
    arbeidstaker: {
        ...tomtArbeidsForhold.arbeidstaker,
      offentligIdent: setFnr()
    }
  };
};

export const genererMockingAvArbeidsForhold = (antall: number): Arbeidsforhold[] => {
  const listeMedArbeidsForhold: Arbeidsforhold[] = [];
  for (let i: number = 0; i < antall;  i++) {
    console.log(lagAnsattForhold());
    listeMedArbeidsForhold.push(lagAnsattForhold());
  }
  return listeMedArbeidsForhold;
};