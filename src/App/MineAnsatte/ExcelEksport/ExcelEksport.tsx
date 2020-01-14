import React,{FunctionComponent} from "react";
import {Hovedknapp} from 'nav-frontend-knapper';
// @ts-ignore
import ReactExport from "react-data-export";
import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";
import {filtrerAktiveOgAvsluttede} from "../sorteringOgFiltreringsFunksjoner";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;



type ExcelEksportProps = {
    arbeidsforholdListe: Arbeidsforhold[],
    className?:string,
    navnBedrift:string,
    orgnrBedrift:string

}

const convertToDataset = (arbeidsforhold:Arbeidsforhold[]) =>{
    const arbeidsforholdDataset: string[][]=[];
    arbeidsforhold.forEach(a => {
        const detteArbeidsforholdet:Array<string> = [];
        detteArbeidsforholdet.push(a.arbeidstaker.navn);
        detteArbeidsforholdet.push(a.arbeidstaker.offentligIdent);
        detteArbeidsforholdet.push(a.yrke);
        detteArbeidsforholdet.push(a.ansattFom);
        detteArbeidsforholdet.push(a.ansattTom);
        arbeidsforholdDataset.push(detteArbeidsforholdet)
    });

  console.log(arbeidsforholdDataset);
    return arbeidsforholdDataset
};

const kolonner = [
    {title: "Navn", width: {wch: 25}},//pixels width
    {title: "Fødselsnummer", width: {wch: 14}},//char width
    {title: "Yrke", width: {wch: 20}},
    {title: "Startdato", width: {wch: 13}},
    {title: "Sluttdato", width: {wch: 13}},
];

const ExcelEksport: FunctionComponent<ExcelEksportProps> = (props:ExcelEksportProps) => {
    const dagensDato:Date = new Date();
    const aktiveArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe,true);
    const aktiveArbeidsforholdDataset = convertToDataset(aktiveArbeidsforhold);
    const avsluttedeArbeidsforhold = filtrerAktiveOgAvsluttede(props.arbeidsforholdListe,false);
    const avsluttedeArbeidsforholdDataset = convertToDataset(avsluttedeArbeidsforhold);
    const avsluttedeArbeidsforholdMultiDataSet = [
        {
            columns: kolonner,
            data: avsluttedeArbeidsforholdDataset
        }
    ];
    const aktiveArbeidsforholdMultiDataSet = [
        {
            columns: kolonner,
            data: aktiveArbeidsforholdDataset
        }
    ];
    return <div className={props.className} >
        <ExcelFile element={<Hovedknapp>Last Ned</Hovedknapp>} filename={"ANSATTFORHOLD_"+props.navnBedrift+"_"+props.orgnrBedrift+"_"+dagensDato.toLocaleDateString()}>
            <ExcelSheet dataSet={ aktiveArbeidsforholdMultiDataSet} name="Aktive arbeidsforhold"/>
            <ExcelSheet dataSet={ avsluttedeArbeidsforholdMultiDataSet} name="Avsluttede arbeidsforhold"/>
        </ExcelFile>
    </div>
    /*
   return <div className={props.className} >
        <ExcelFile element={<Hovedknapp>Last Ned</Hovedknapp>} filename={"ANSATTFORHOLD_"+props.navnBedrift+"_"+props.orgnrBedrift+"_"+dagensDato.toLocaleDateString()} >
            <ExcelSheet data={aktiveArbeidsforhold} name="Aktive arbeidsforhold">
                <ExcelColumn label="Navn" value={(col:Arbeidsforhold) => col.arbeidstaker.navn} />
                <ExcelColumn label="Fødselsnummer" value={(col:Arbeidsforhold) => col.arbeidstaker.offentligIdent}/>
                <ExcelColumn label="Yrke" value="yrke"/>
                <ExcelColumn label="Startdato" value={"ansattFom"}/>
                <ExcelColumn label="Sluttdato" value={"ansattTom"}/>
            </ExcelSheet>
        <ExcelSheet data={avsluttedeArbeidsforhold} name="Avsluttede arbeidsforhold">
            <ExcelColumn label="Navn" value={(col:Arbeidsforhold) => col.arbeidstaker.navn}/>
            <ExcelColumn label="Fødselsnummer" value={(col:Arbeidsforhold) => col.arbeidstaker.offentligIdent}/>
            <ExcelColumn label="Yrke" value="yrke"/>
            <ExcelColumn label="Startdato" value={"ansattFom"}/>
            <ExcelColumn label="Sluttdato" value={"ansattTom"}/>
        </ExcelSheet>
    </ExcelFile>
   </div>*/
};



export default ExcelEksport