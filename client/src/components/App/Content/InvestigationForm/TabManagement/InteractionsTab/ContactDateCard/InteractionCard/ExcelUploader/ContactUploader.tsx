import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Typography } from '@material-ui/core';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import Contact from 'models/Contact';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import useDuplicateContactId from 'Utils/vendor/useDuplicateContactId';
import { ParsedExcelRow } from 'models/enums/contactQuestioningExcelFields';
import useContactFields, { ValidationReason } from 'Utils/vendor/useContactFields';

import useStyles from './ExcelUploaderStyles';
import useContactExcel from './useContactExcel';

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
    
    const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    
    const existingContacts : Contact[] = allInteractions
    .flatMap(interaction => interaction.contacts
        .map(contact => ({...contact,
            startTime: interaction.startTime})
        )
    );
    
    const onFail = () => alertError('שגיאה בטעינת הקובץ');

    const { onFileSelect } = useContactExcel(setData, onFail);
    const { alertError } = useCustomSwal();
    const { validateContact } = useContactFields();
    const { checkExcelDuplicateKeys } = useDuplicateContactId();
    
    const classes = useStyles();
    
    React.useEffect(() => {
        saveDataInFile(data)
    }, [data]);
    
    const onButtonClick = () => buttonRef?.current?.click();

    const saveDataInFile = (contacts?: ParsedExcelRow[]) => {
        if(contacts && contacts.length > 0) {
            const dataInFileLogger = logger.setup({
                workflow: 'Saving Contacted People Excel',
                user: userId,
                investigation: epidemiologyNumber,
            })
            dataInFileLogger.info('launching saving contacted people excel request', Severity.LOW);

            const validationErrors = contacts.reduce<string[]>((aggregatedArr, contact) => {
                const validationInfo = validateContact(contact, ValidationReason.EXCEL_LOADING);

                if (!validationInfo.valid) {
                    const error = `שגיאה בשורה ${contact.rowNum + 1}: `.concat(validationInfo.error);
                    aggregatedArr.push(error);
                }
                return aggregatedArr;
            }, []);

            if(validationErrors.length > 0) {
                alertError(validationErrors.join("\r\n"));
                dataInFileLogger.info(`failed to upload excel, validation errors on data: ${validationErrors.join(',')}`, Severity.HIGH);
            } else {
                const contactsData = contacts.map(contact => {
                    const { rowNum, ...contactData } = contact;
                    return contactData;
                });
                if (!checkExcelDuplicateKeys(contacts, existingContacts)) {
                    axios.post('/contactedPeople/excel', { contactEvent, contacts: contactsData })
                        .then(() => {
                            dataInFileLogger.info('contacted people excel was saved successfully', Severity.LOW);
                            onSave();
                        })
                        .catch(error => {
                            dataInFileLogger.error(`got error from server: ${error}`, Severity.LOW);
                            alertError('שגיאה בשמירת הנתונים');
                        })
                }
            }
        }
    };

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