import React from 'react';
import { Close } from '@material-ui/icons';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';

import SignUpUser from 'models/SignUpUser';
import FormMode from 'models/enums/FormMode';
import SignUpFields from 'models/enums/SignUpFields';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from '../../SignUp/SignUpStyles';
import SignUpForm from '../../SignUp/SignUpForm/SignUpForm';

const EditUserInfoDialog: React.FC<Props> = ({ open, defaultValues, handleCloseEditUserDialog }: Props) => {
    
    const userInfoTitle = defaultValues[SignUpFields.MABAR_USER_NAME]
    const classes = useStyles();

    return (
        <Dialog open={open} maxWidth='sm' fullWidth={true}>
            <DialogTitle>
                {userInfoTitle}
                <IconButton aria-label='close' className={classes.closeButton} onClick={handleCloseEditUserDialog}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <SignUpForm 
                    defaultValues={defaultValues}
                    mode={FormMode.EDIT}
                    handleSaveUser={handleCloseEditUserDialog}
                />
            </DialogContent>

            <DialogActions>
                <PrimaryButton onClick={handleCloseEditUserDialog}>
                    ביטול
                </PrimaryButton>
                <PrimaryButton 
                    type='submit'
                    form='signUp'
                >
                    שמירה
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    )
}

export default EditUserInfoDialog;

interface Props {
    open: boolean;
    defaultValues: SignUpUser;
    handleCloseEditUserDialog: () => void;
}
