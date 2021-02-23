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
            const newBankValue = {
                contactType,
                extraInfo,
                checked: person ? !person.checked : true
            }
            tempBank.set(personInfo , newBankValue);

            setContactBank(tempBank);
        }
    }

    const handleContactTypeChange = (selectedType? :  number | unknown) => {
        if(personInfo && typeof selectedType === 'number') {
            let tempBank = contactBank;
            const person = contactBank.get(personInfo);
            const newBankValue = person 
                ? {
                    contactType: selectedType,
                    extraInfo: person.extraInfo,
                    checked: person.checked
                }
                : {
                    contactType: selectedType,
                    extraInfo: contact.extraInfo,
                    checked: false
                }
            tempBank.set(personInfo , newBankValue);

            setContactBank(tempBank);
        }
    }

    const handleExtraInfoChange = (selectedInfo : string | unknown) => {
        if(personInfo && typeof selectedInfo === 'string') {
            let tempBank = contactBank;
            const person = contactBank.get(personInfo);
            const newBankValue = person 
                ? {
                    ...person,
                    extraInfo : selectedInfo
                }
                : {
                    contactType,
                    extraInfo: selectedInfo,
                    checked: false
                }
            tempBank.set(personInfo , newBankValue);

            setContactBank(tempBank);
        }
    }

    return {
        isPersonChecked,
        handleCheckboxClick,
        handleContactTypeChange,
        handleExtraInfoChange
    }
}

interface Props {
    contact: Contact;
}

export default UseRow;