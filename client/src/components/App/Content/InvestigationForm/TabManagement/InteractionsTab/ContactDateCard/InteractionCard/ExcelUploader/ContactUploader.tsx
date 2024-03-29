import React from 'react';
import axios  from 'axios';
import { Button, Typography } from '@material-ui/core';

import logger from 'logger/logger';
import Contact from 'models/Contact';
import { Severity } from 'models/Logger';
import ContactStatus from 'models/enums/ContactStatus';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import { ParsedExcelRow } from 'models/enums/contactQuestioningExcelFields';
import useContactFields, { ValidationReason } from 'Utils/Contacts/useContactFields';

import useStyles from './ExcelUploaderStyles';
import useContactExcel from './useContactExcel';
import CreationSourceCodes from 'models/enums/CreationSourceCodes';

const fileEndings = [
    'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
].map((suffix) => `.${suffix}`).join(',');

interface ExcelUploaderProps {
    contactEvent: number;
    onSave: () => void;
    allInteractions: Interaction[];
}

const ContactUploader = ({ contactEvent, onSave, allInteractions }: ExcelUploaderProps) => {
    const [data, setData] = React.useState<ParsedExcelRow[] | undefined>();
    
    const buttonRef = React.useRef<HTMLInputElement>(null);

    const onFail = () => alertError('שגיאה בטעינת הקובץ');

    const { onFileSelect } = useContactExcel(setData, onFail);
    const { alertError } = useCustomSwal();
    const { validateContact } = useContactFields();

    const classes = useStyles();
    
    React.useEffect(() => {
        saveDataInFile(data)
    }, [data]);
    
    const onButtonClick = () => buttonRef?.current?.click();

    const checkDuplicatesContactsFromExcel = (contacts: ParsedExcelRow[]) => {
        return contacts.map(contact => contact.identificationNumber).filter((e, i, a) => e !== undefined && a.indexOf(e) !== i);
    }

    const saveDataInFile = (contacts?: ParsedExcelRow[]) => {
        if(contacts && contacts.length > 0) {
            const dataInFileLogger = logger.setup('Saving Contacted People Excel');
            dataInFileLogger.info('launching saving contacted people excel request', Severity.LOW);
            const validationErrors = contacts.reduce<string[]>((aggregatedArr, contact) => {
                const parsedContact = contact.cityId 
                ? {
                    ...contact,
                    isolationAddress: {
                        city : {id: String(contact.cityId) , displayName : ''},
                        street : {id : String(contact.streetId) , displayName: ''},
                        houseNum : '',
                        apartment : '',
                        floor : '', 
                    }
                } 
                : contact;
                const validationInfo = validateContact(parsedContact, ValidationReason.EXCEL_LOADING);

                if (!validationInfo.valid) {
                    const error = `שגיאה בשורה ${contact.rowNum + 1}: `.concat(validationInfo.error);
                    aggregatedArr.push(error);
                }
                return aggregatedArr;
            }, []);

            const duplicatesContactsFRomExcel = checkDuplicatesContactsFromExcel(contacts);
            if (duplicatesContactsFRomExcel.length > 0 ) {
                const error =`חלה שגיאה בטעינת הקובץ,
                קיימים מספרים מזהים כפולים: 
                ${duplicatesContactsFRomExcel .join(', ')}`;
                validationErrors.push(error);
            }

            const existingBankIds = contactsExistsInBank(contacts);
            if(existingBankIds && existingBankIds?.length > 0) {
                alertError(`ת.ז. ${existingBankIds  .join(', ')} כבר קיים בבנק המגעים`);
            } else if(validationErrors.length > 0) {
                alertError(validationErrors.join("\r\n"));
                dataInFileLogger.info(`failed to upload excel, validation errors on data: ${validationErrors.join(',')}`, Severity.HIGH);
            } else {
                const contactsData = contacts.map(contact => {
                    const { rowNum, ...contactData } = contact;
                    return {...contactData, contactStatus: contactData.contactStatus || ContactStatus.NEW , creationSource:CreationSourceCodes.EVEN_YESOD};
                });
                setIsLoading(true);
                axios.post('/contactedPeople/excel', { contactEvent, contacts: contactsData })
                    .then(() => {
                        dataInFileLogger.info('contacted people excel was saved successfully', Severity.LOW);
                        onSave();
                    })
                    .catch(error => {
                        dataInFileLogger.error(`got error from server: ${error}`, Severity.LOW);
                        alertError('שגיאה בשמירת הנתונים');
                    })
                    .finally(() => setIsLoading(false));
            }
        }
    };

    const contactsExistsInBank = (contacts? : ParsedExcelRow[]) => {
        const allIdsSet = getAllExistingContactIds();
        const existingContacts = contacts?.map(contact => contact.identificationNumber)
            .filter(id => {
                return Boolean(id) && allIdsSet.has(id)
            });

        return existingContacts
    }

    const getAllExistingContactIds = () => {
        const allIds = allInteractions
            .flatMap(interaction => 
                interaction.contacts
                    .map(contact => 
                        contact.identificationNumber
                    )    
            )

        return new Set(allIds)
    }

    return (
        <>
            <Button className={classes.uploadButton} onClick={onButtonClick}>
                <img className={classes.logo} src='./assets/img/uploadExcel.png' alt='excel'/>
                <Typography variant='body2'>
                    טען אקסל
                </Typography>
            </Button>
            <input type='file' accept={fileEndings}
                   ref={buttonRef} className={classes.hiddenFileInput}
                   onChange={onFileSelect}/>
        </>
    );
};

export default ContactUploader;