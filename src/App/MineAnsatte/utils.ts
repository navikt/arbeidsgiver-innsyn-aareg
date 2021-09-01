
export const datoformat = (datoTekst: string | undefined) => {
    if (datoTekst === undefined) {
        return undefined;
    }

    const date = new Date(datoTekst)
    const toSiffer = (n: number) => n.toString().padStart(2, "0");


    return `${toSiffer(date.getDate())}.${toSiffer(date.getMonth())}.${date.getFullYear()}`
}

