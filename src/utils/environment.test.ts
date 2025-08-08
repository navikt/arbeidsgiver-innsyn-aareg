import environment, { gittMiljo } from './environment';

it('sjekk at gittMiljø git dev hvis environment.miljø er dev gcp', () => {
    environment.MILJO = 'dev';
    expect(
        gittMiljo<'PROD' | 'DEV' | 'LOCAL'>({
            prod: 'PROD',
            dev: 'DEV',
            other: 'LOCAL',
        })
    ).toBe('DEV');
});

it('sjekk at gittMiljø fallback er other', () => {
    environment.MILJO = 'dev';
    expect(
        gittMiljo<'PROD' | 'DEV' | 'LOCAL'>({
            prod: 'PROD',
            other: 'LOCAL',
        })
    ).toBe('LOCAL');
});
