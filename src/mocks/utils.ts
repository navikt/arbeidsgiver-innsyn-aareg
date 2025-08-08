export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));
