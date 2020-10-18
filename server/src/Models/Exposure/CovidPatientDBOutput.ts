interface CovidPatientDBOutput {
    fullName: string;
    identityNumber: string;
    primaryPhone: string;
    epidemiologyNumber: number;
    birthDate: Date;
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