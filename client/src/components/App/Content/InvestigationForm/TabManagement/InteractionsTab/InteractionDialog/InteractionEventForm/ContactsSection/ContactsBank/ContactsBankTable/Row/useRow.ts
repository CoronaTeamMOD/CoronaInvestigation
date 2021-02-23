import React, { useContext } from 'react';

import Contact from 'models/Contact';
import {contactBankContext} from 'commons/Contexts/ContactBankContext';

const UseRow = (props : Props) => {
    
    const { contact } = props;
    const { personInfo, contactType, extraInfo } = contact;

    const {contactBank , setContactBank} = useContext(contactBankContext);

    const isPersonChecked = () => {
        if(personInfo){
            return contactBank.get(personInfo)?.checked
        }
        return false
    }

    const handleCheckboxClick = () => {
        if(personInfo){
            let tempBank = contactBank;
            const person = contactBank.get(personInfo);
            if(person) {
                tempBank.set(personInfo, {
                    contactType,
                    extraInfo,
                    checked: !person.checked
                });
            } else {
                tempBank.set(personInfo , {
                    contactType,
                    extraInfo,
                    checked: true
                });
            }
            
            setContactBank(tempBank);
        }
    }

    return {
        isPersonChecked,
        handleCheckboxClick
    }
}

interface Props {
    contact: Contact;
}

export default UseRow;