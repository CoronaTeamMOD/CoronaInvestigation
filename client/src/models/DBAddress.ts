interface DBAddress {
    city: string;
    street: string;
    floor: string;
    houseNum: string;
}

export const initDBAddress: DBAddress  = {
    city: '',
    street: '',
    floor: '',
    houseNum: '',
};

export default DBAddress;
