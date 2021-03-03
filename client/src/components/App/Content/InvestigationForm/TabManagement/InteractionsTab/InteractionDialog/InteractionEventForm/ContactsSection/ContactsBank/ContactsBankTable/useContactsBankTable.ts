import React from 'react'

import Contact from 'models/Contact';

const UseContactsBankTable = (props: Props) => {
    const { existingPersons, query } = props;
    
    const filteredPersons = Array.from(existingPersons)
        .map(person => person[1])
        .filter(contact => {
            if(query) {
                const { firstName, lastName, identificationNumber, phoneNumber } = contact;
                const searchableFields = [firstName,lastName,identificationNumber,phoneNumber];
                return searchableFields.some(field => field?.includes(query));
            }
            return true;
        });
        
    return {
        filteredPersons
    }
}

interface Props {
    existingPersons: Map<number,Contact>;
    query: string;
}

export default UseContactsBankTable;
