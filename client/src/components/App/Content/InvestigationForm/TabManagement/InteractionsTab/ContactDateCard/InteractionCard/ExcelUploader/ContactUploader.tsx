import React from 'react';
import axios from 'Utils/axios';
import {Button, Typography} from '@material-ui/core';

import InteractedContact from 'models/InteractedContact';
import useContactExcel from './useContactExcel';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import useStyles from './ExcelUploaderStyles';

const fileEndings = [
    'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
].map((suffix) => `.${suffix}`).join(',');

interface ExcelUploaderProps {
    contactEvent:number;
    onSave: () => void;
}
const ContactUploader = ({contactEvent, onSave}:ExcelUploaderProps) => {
    const {alertError} = useCustomSwal();
    const [data, setData] = React.useState<InteractedContact[] | undefined>();
    const buttonRef = React.useRef<HTMLInputElement>(null);
    const onFail = () => alertError('שגיאה בטעינת הקובץ');
    const {onFileSelect} = useContactExcel(setData, onFail);

    const classes = useStyles();

    React.useEffect(() => {
        saveDataInFile(data)
    }, [data]);

    const onButtonClick = () => buttonRef?.current?.click();

    const saveDataInFile = (contacts?: InteractedContact[]) => {
        if(contacts && contacts.length > 0) {
            axios.post('/contactedPeople/excel', {contactEvent, contacts})
                .then(onSave)
                .catch(e => {
                    console.error(e);
                    alertError('שגיאה בשמירת הנתונים');
                })
        }
    };

    return (
        <>
            <Button className={classes.button} onClick={onButtonClick}>
                <img className={classes.logo} src='./assets/img/ExcelLogo.png' alt='excel'/>
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