import React, { useContext } from 'react';

import Contact from 'models/Contact';
import {contactBankContext} from 'commons/Contexts/ContactBankContext';

import useStyles from './rowStyles';

const UseRow = (props : Props) => {
    const { contact } = props;
    const { personInfo } = contact;

    const classes = useStyles();
    const { contactBank , setContactBank, existingEventPersonInfos } = useContext(contactBankContext);

    const isPersonChecked = () => {
        if(personInfo){
            return contactBank.get(personInfo)?.checked
        }
        return false
    }

    const doesPersonExistInEvent = () => {
        if(personInfo){
            return existingEventPersonInfos?.indexOf(personInfo) !== -1;
        }
        return false
    }

    const handleCheckboxClick = () => {
        if(personInfo){
            let tempBank = new Map(contactBank);
            const person = contactBank.get(personInfo);
            const newBankValue = {
                contactType : person?.contactType || 1,
                extraInfo : person?.extraInfo || '',
                checked: person ? !person.checked : true
            }
            tempBank.set(personInfo , newBankValue);

            setContactBank(tempBank);
        }
    }

    const handleContactTypeChange = (selectedType? :  number | unknown) => {
        if(personInfo && typeof selectedType === 'number') {
            let tempBank = new Map(contactBank);
            const person = contactBank.get(personInfo);
            const newBankValue = {
                    contactType: selectedType,
                    extraInfo: person?.extraInfo || '',
                    checked: person?.checked || false
            }
            tempBank.set(personInfo , newBankValue);

            setContactBank(tempBank);
        }
    }

    const handleExtraInfoChange = (selectedInfo : string | unknown) => {
        if(personInfo && typeof selectedInfo === 'string') {
            let tempBank = new Map(contactBank);
            const person = contactBank.get(personInfo);
            const newBankValue = {
                    contactType: person?.contactType || 1,
                    checked: person?.checked || false,
                    extraInfo : selectedInfo
                }
            tempBank.set(personInfo , newBankValue);

            setContactBank(tempBank);
        }
    }

    const getRowClass = () => {
        if(doesPersonExistInEvent()) {
            return classes.disabled;
        } else if (isPersonChecked()) {
            return classes.selected;
        }
        return '';
    }

    return {
        isPersonChecked,
        handleCheckboxClick,
        handleContactTypeChange,
        handleExtraInfoChange,
        doesPersonExistInEvent,
        getRowClass
    }
}

interface Props {
    contact: Contact;
}

export default UseRow;