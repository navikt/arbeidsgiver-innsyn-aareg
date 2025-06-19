import { fakerNB_NO as faker } from '@faker-js/faker';

export const orgnr = () => faker.number.int({ min: 100000000, max: 999999999 }).toString();
export const fnr = () => faker.number.int({ min: 10000000000, max: 99999999999 }).toString();

export const fakeName = () => `${faker.person.firstName()} ${faker.vehicle.vehicle()}`;

export const dateInPast = ({ hours = 0, days = 0, years = 0, months = 0 }) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(date.getHours() - hours);
    date.setFullYear(date.getFullYear() - years);
    date.setMonth(date.getMonth() - months);
    return date;
};

export const dateInFuture = ({ hours = 0, days = 0, years = 0, months = 0 }) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(date.getHours() + hours);
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    return date;
};
