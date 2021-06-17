import { environment, gittMiljø } from './environment';

it("sjekk at gittMiljø git dev hvis environment.miljø er dev sbs",()=>{
    environment.MILJO="dev-sbs"
    expect(gittMiljø<'PROD' | 'DEV' | 'LOCAL'>({
        prod: 'PROD',
        dev: 'DEV',
        other: 'LOCAL',
    })).toBe("DEV")

})

it("sjekk at gittMiljø fallback er other",()=>{
    environment.MILJO="dev-sbs"
    expect(gittMiljø<'PROD' | 'DEV' | 'LOCAL'>({
        prod: 'PROD',
        other: 'LOCAL',
    })).toBe("LOCAL")

})
