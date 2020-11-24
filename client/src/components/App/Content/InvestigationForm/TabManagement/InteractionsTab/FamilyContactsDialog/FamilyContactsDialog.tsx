import React from 'react';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@material-ui/core';
    
import InvolvedContact from 'models/InvolvedContact';

import useStyles from './FamilyContactsDialogStyles';
import FamilyContactsTable from './FamilyContactsTable/FamilyContactsTable';

const titleFirstLine = 'לא הוספת את בני המשפחה הבאים כמגעים';
const titleSecondLine = 'האם הינך בטוח שהם אינם באו במגע עם המאומת?';

const FamilyContactsDialog: React.FC<Props> = (props: Props): JSX.Element => {
    const { isOpen, closeDialog, uncontactedFamilyMembers, confirmDialog } = props;
    
    const classes = useStyles();
    
    return (
        <Dialog classes={{paper: classes.paper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.title}>
                <ReportProblemOutlinedIcon className={classes.warningIcon} />
                <Typography variant='h4'>{titleFirstLine}</Typography>
                <Typography variant='h4'>{titleSecondLine}</Typography>
            </DialogTitle>
            <DialogContent className={classes.content}>
                <FamilyContactsTable className={classes.table} familyMembers={uncontactedFamilyMembers}/>
            </DialogContent>
            <DialogActions className={classes.footer}>
                <Button
                    variant='contained'
                    onClick={closeDialog}
                    className={classes.cancelButton}
                >
                    לא
                </Button>
                <Button
                    variant='contained'
                    className={classes.confirmButton}
                    onClick={confirmDialog}
                >
                    כן
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FamilyContactsDialog;

interface Props {
    isOpen: boolean;
    uncontactedFamilyMembers: InvolvedContact[];
    closeDialog: () => void;
    confirmDialog: () => void;
};
