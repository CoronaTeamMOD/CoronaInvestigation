import React from 'react';
import SchoolIcon from '@material-ui/icons/SchoolOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@material-ui/core';

import InvolvedContact from 'models/InvolvedContact';

import EducationContact from './EducationContact';
import useStyles from './EducationContactsDialogStyles';

const title = 'מגעי חינוך';

const EducationContactsDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { isOpen, closeDialog, educationContacts } = props;
    
    const classes = useStyles();
    
    return (
        <Dialog classes={{paper: classes.paper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.title}>
                <Typography variant='h6' className={classes.titleTypography}>
                    <SchoolIcon className={classes.titleIcon}/>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogContent className={classes.content}>
                {
                    educationContacts.map(contact => 
                        <>
                            <EducationContact contact={contact}/>
                            <Divider/>
                        </>
                    )
                }
            </DialogContent>
            <DialogActions className={classes.footer}>
                <Button
                    variant='contained'
                    onClick={closeDialog}
                    color='default'
                    className={classes.cancelButton}
                >
                    אישור
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EducationContactsDialog;

interface Props {
    isOpen: boolean;
    educationContacts: InvolvedContact[];
    closeDialog: () => void;
};
