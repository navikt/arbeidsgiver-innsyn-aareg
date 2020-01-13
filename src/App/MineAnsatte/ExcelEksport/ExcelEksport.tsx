import React,{FunctionComponent} from "react";
// @ts-ignore
import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const data = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];



const ExcelEksport: FunctionComponent = () => {
return <div>
    <Download/>
</div>
};

const Download:FunctionComponent = () =>{

return <ExcelFile element={<button>Download Data</button>}>
        <ExcelSheet data={data} name="Employees">
            <ExcelColumn label="Name" value="name"/>
            <ExcelColumn label="Wallet Money" value="amount"/>
            <ExcelColumn label="Gender" value="sex"/>
            <ExcelColumn label="Marital Status"
                         value={(col: { is_married: any; }) => col.is_married ? "Married" : "Single"}/>
        </ExcelSheet>
</ExcelFile>

}

export default ExcelEksport