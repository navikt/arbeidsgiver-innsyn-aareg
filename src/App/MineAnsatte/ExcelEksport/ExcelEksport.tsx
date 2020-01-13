import React,{FunctionComponent} from "react";
import {Hovedknapp} from 'nav-frontend-knapper';
// @ts-ignore
import ReactExport from "react-data-export";
import {Arbeidsforhold} from "../../Objekter/ArbeidsForhold";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;


type ExcelEksportProps = {
    arbeidsforholdListe: Arbeidsforhold[],
    className?:string
}


const ExcelEksport: FunctionComponent<ExcelEksportProps> = (props:ExcelEksportProps) => {
   return <div className={props.className} >
        <ExcelFile element={<Hovedknapp>Last Ned</Hovedknapp>}>
        <ExcelSheet data={props.arbeidsforholdListe} name="Employees">
            <ExcelColumn label="Navn" value={(col:Arbeidsforhold) => col.arbeidstaker.navn}/>
            <ExcelColumn label="Fødselsnummer" value={(col:Arbeidsforhold) => col.arbeidstaker.offentligIdent}/>
            <ExcelColumn label="Yrke" value="yrke"/>
            <ExcelColumn label="Startdato" value={"ansattFom"}/>
            <ExcelColumn label="Sluttdato" value={"ansattTom"}/>
        </ExcelSheet>
    </ExcelFile>
   </div>
};


export default ExcelEksport