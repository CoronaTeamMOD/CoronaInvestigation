import React from 'react';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';

import axios from 'Utils/axios';
import {Button, Typography} from '@material-ui/core';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import InteractedContact from 'models/InteractedContact';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useDuplicateContactId, { duplicateIdsErrorMsg } from 'Utils/vendor/useDuplicateContactId';
import useContactFields from 'Utils/vendor/useContactFields';

import useContactExcel from './useContactExcel';
import useStyles from './ExcelUploaderStyles';
import {ParsedExcelRow} from 'models/enums/contactQuestioningExcelFields';

const fileEndings = [
    'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
].map((suffix) => `.${suffix}`).join(',');

interface ExcelUploaderProps {
    contactEvent:number;
    onSave: () => void;
}
const ContactUploader = ({contactEvent, onSave}:ExcelUploaderProps) => {
    const {alertError} = useCustomSwal();
    const {validateContact} = useContactFields();
    const [data, setData] = React.useState<ParsedExcelRow[] | undefined>();
    const buttonRef = React.useRef<HTMLInputElement>(null);
    const onFail = () => alertError('שגיאה בטעינת הקובץ');
    const {onFileSelect} = useContactExcel(setData, onFail);
    const { handleDuplicateIdsError } = useDuplicateContactId();

    const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const classes = useStyles();

    React.useEffect(() => {
        saveDataInFile(data)
    }, [data]);

    const onButtonClick = () => buttonRef?.current?.click();

    const saveDataInFile = (contacts?: ParsedExcelRow[]) => {
        if(contacts && contacts.length > 0) {
            const logInfo = {
                service: Service.CLIENT,
                workflow: 'Saving Contacted People Excel',
                investigation: epidemiologyNumber,
                user: userId
            };

            logger.info({
                ...logInfo,
                severity: Severity.LOW,
                step: 'launching saving contacted people excel request',
            });

            const validationErrors = contacts.reduce<string[]>((aggregatedArr, contact) => {
                const validationInfo = validateContact(contact, true);

                if (!validationInfo.valid) {
                    const error = `שגיאה בשורה ${contact.rowNum + 1}: `.concat(validationInfo.error);
                    aggregatedArr.push(error);
                }
                return aggregatedArr;
            }, []);

            if(validationErrors.length > 0) {
                alertError(validationErrors.join("\r\n"));
                logger.error({
                    ...logInfo,
                    severity: Severity.HIGH,
                    step: `failed to upload excel, validation errors on data: ${validationErrors.join(',')}`,
                });
            } else {
                const contactsData = contacts.map(contact => {
                    const {rowNum, ...contactData} = contact;
                    return contactData;
                });
                axios.post('/contactedPeople/excel', {contactEvent, contacts: contactsData})
                    .then((result) => {
                        if (result.data.includes(duplicateIdsErrorMsg)) {
                            handleDuplicateIdsError(result.data.split(':')[1], userId, epidemiologyNumber);
                        } else {
                            logger.info({
                                ...logInfo,
                                severity: Severity.LOW,
                                step: 'contacted people excel was saved successfully',
                            })
                            onSave();
                        }
                    })
                    .catch(error => {
                        logger.error({
                            ...logInfo,
                            severity: Severity.LOW,
                            step: `got error from server: ${error}`,
                        });
                        alertError('שגיאה בשמירת הנתונים');
                    })
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