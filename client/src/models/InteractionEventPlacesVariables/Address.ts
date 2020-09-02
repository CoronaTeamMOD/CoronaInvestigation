export interface Address {
    city: string;
    neighborhood: string;
    street: string;
    houseNumber: number;
    entrance: string;
    floor: number;
}

export const initAddress : Address = {
    city: '',
    neighborhood: '',
    street: '',
    houseNumber: -1,
    entrance: '',
    floor: -1
}

export default Address;