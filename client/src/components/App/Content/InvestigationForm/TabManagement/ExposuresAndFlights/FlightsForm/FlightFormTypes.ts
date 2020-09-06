
export interface Country {
    id: string | '';
    name: string | '';
}

export interface City {
    id: string | '';
    name: string | '';
    country: Country;
}

export type Airport = string;
// export interface Airport {
//     name: string | '';
//     city: City;
// }
