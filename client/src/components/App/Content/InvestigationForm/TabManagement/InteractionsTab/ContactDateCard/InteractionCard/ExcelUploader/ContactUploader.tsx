import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import {Button, Typography} from '@material-ui/core';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useDuplicateContactId from 'Utils/vendor/useDuplicateContactId';

import useContactExcel from './useContactExcel';
import useStyles from './ExcelUploaderStyles';

const fileEndings = [
    'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
].map((suffix) => `.${suffix}`).join(',');

interface ExcelUploaderProps {
    contactEvent: number;
    onSave: () => void;
    allInteractions: Interaction[];
}
const ContactUploader = ({contactEvent, onSave, allInteractions} :ExcelUploaderProps) => {
    const existingContacts = allInteractions.map(interaction => interaction.contacts).flat();
    const existingContactsIds : string[] = existingContacts.map(contact => contact.idNumber).filter(id => id !== null && id !== '') as string[];
    const {alertError} = useCustomSwal();
    const [data, setData] = React.useState<InteractedContact[] | undefined>();
    const buttonRef = React.useRef<HTMLInputElement>(null);
    const onFail = () => alertError('שגיאה בטעינת הקובץ');
    const {onFileSelect} = useContactExcel(setData, onFail);

    const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const classes = useStyles();

    React.useEffect(() => {
        saveDataInFile(data)
    }, [data]);
    const { checkDuplicateIds } = useDuplicateContactId();

    const onButtonClick = () => buttonRef?.current?.click();
    
    const saveDataInFile = (contacts?: InteractedContact[]) => {
        if(contacts && contacts.length > 0) {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Saving Contacted People Excel',
                step: 'launching saving contacted people excel request',
                investigation: epidemiologyNumber,
                user: userId
            })
            const excelContactsIds = contacts.map((contact) => contact.identificationNumber)
                                             .filter(id => id !== null && id !== '');
            if(contacts.some((contact) => contact.contactStatus == 'הושלם התחקור')) {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Saving Contacted People Excel',
                    step: `trying to save excel with complete status contact`,
                    investigation: epidemiologyNumber,
                    user: userId
                })
                alertError('לא ניתן לטעון מגע בסטטוס הושלם התחקור, שנו סטטוס זה ונסו שוב');
            }
            else {
                if(!checkDuplicateIds(excelContactsIds.concat(existingContactsIds))) {
                    axios.post('/contactedPeople/excel', {contactEvent, contacts})
                        .then((result) => {
                                logger.info({
                                    service: Service.CLIENT,
                                    severity: Severity.LOW,
                                    workflow: 'Saving Contacted People Excel',
                                    step: 'contacted people excel was saved successfully',
                                    investigation: epidemiologyNumber,
                                    user: userId
                                })
                                onSave();
                        })
                        .catch(error => {
                            logger.error({
                                service: Service.CLIENT,
                                severity: Severity.LOW,
                                workflow: 'Saving Contacted People Excel',
                                step: `got error from server: ${error}`,
                                investigation: epidemiologyNumber,
                                user: userId
                            })
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