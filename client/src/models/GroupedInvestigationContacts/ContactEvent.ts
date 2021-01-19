type ContactEvent = {
    contactedPeopleByContactEvent : {
        nodes: {
            addressByIsolationAddress: {
                cityByCity: {
                    displayName: string;
                }
            },
            personByPersonInfo: {
                firstName : string;
                lastName : string;
                id : number;
                identificationNumber: string;
            }
        }[]
    }
}

export default ContactEvent;