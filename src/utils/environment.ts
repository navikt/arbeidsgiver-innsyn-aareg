
interface Environment {
    MILJO: string;
}

export const environment: Environment = {
    MILJO: (window as any)?.appSettings?.MILJO ?? 'local'
};

interface GittMiljø<T> {
    prod: T;
    dev?: T;
    labs?: T;
    other?: T;
}

const PROD_REGEX = /^prod-.*/.compile()
const DEV_REGEX = /^dev-.*/.compile()
const LABS_REGEX = /^labs-.*/.compile()

export const gittMiljø = <T>(valg: GittMiljø<T>): T => {
    const miljø = environment.MILJO;
    if (PROD_REGEX.test(miljø)) {
        return valg.prod;
    }

    if (DEV_REGEX.test(miljø) && valg.dev !== undefined) {
        return valg.dev;
    }

    if (LABS_REGEX.test(miljø) && valg.labs !== undefined) {
        return valg.labs;
    }

    if (valg.other !== undefined) {
        return valg.other;
    }

    console.error(`gittMiljø: ingen valgmuligheter for '${miljø}'`)
    return undefined as any
}