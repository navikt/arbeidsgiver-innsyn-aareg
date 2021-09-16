
export const datoformat = (datoTekst:string|undefined|null) => {
    if (datoTekst === undefined || datoTekst === null) {
        return undefined;
    }

    const date = new Date(datoTekst)
    const toSiffer = (n: number) => n.toString().padStart(2, "0");


    return `${toSiffer(date.getDate())}.${toSiffer(date.getMonth()+1)}.${date.getFullYear()}`
}

