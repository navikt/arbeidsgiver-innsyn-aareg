export class FetchError extends Error {
    public response: Response;

    constructor(reason: string, response: Response) {
        super(reason);
        this.response = response;
    }
}

export async function fetchJson<T>(
    url: string,
    headers: Record<string, string> = {}
): Promise<T> {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        const reason = response.statusText !== '' ? response.statusText : response.type;
        throw new FetchError(reason, response);
    }
    return response.json();
}