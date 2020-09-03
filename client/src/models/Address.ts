export interface Address {
    city: string;
    neighborhood?: string;
    street?: string;
    houseNumber?: string;
    entrance?: string;
    floor?: string;
}

export const initAddress : Address = {
    city: '',
}

export default Address;