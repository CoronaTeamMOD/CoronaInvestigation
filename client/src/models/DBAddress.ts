interface DBAddress {
    city: string;
    street: string;
    floor: string;
    houseNum: string;
    streetName?: string;
    addressId?: number | null;
}

export const initDBAddress: DBAddress  = {
    city: '',
    street: '',
    floor: '',
    houseNum: '',
    addressId: null
};

export default DBAddress;
