interface CovidPatientDBOutput {
    fullName: string;
    identityNumber: string;
    primaryPhone: string;
    epidemiologyNumber: number;
    birthDate: Date;
    age: number; 
    addressByAddress: AddressDBOutput;
}

export interface AddressDBOutput {
    cityByCity: {
        displayName: string
    }
    streetByStreet: {
        displayName: string
    }
    floor: string,
    houseNum: string
}

export default CovidPatientDBOutput;