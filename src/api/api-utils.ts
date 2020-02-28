export enum APISTATUS {
    LASTER,
    OK,
    FEILET
}

export class FetchError extends Error {
    public response: Response;

    constructor(reason: string, response: Response) {
        super(reason);
        this.response = response;
    }
}