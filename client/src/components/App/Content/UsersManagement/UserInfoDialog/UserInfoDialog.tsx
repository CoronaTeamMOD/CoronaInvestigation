import React from 'react';
import { Close } from '@material-ui/icons';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';

import SignUpUser from 'models/SignUpUser';
import FormMode from 'models/enums/FormMode';
import SignUpFields from 'models/enums/SignUpFields';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from '../../SignUp/SignUpStyles';
import SignUpForm from '../../SignUp/SignUpForm/SignUpForm';

const UserInfoDialog: React.FC<Props> = ({ open, defaultValues, handleCloseDialog }: Props) => {
    const userInfoTitle = defaultValues[SignUpFields.MABAR_USER_NAME]

    const classes = useStyles();

    return (
        <Dialog open={open} maxWidth='sm' fullWidth={true}>
            <DialogTitle>
                {userInfoTitle}
                <IconButton test-id='closeUserInfoDialog' aria-label='close' className={classes.closeButton} onClick={handleCloseDialog}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <SignUpForm 
                    defaultValues={defaultValues}
                    mode={FormMode.READ}
                />
            </DialogContent>

            <DialogActions>
                <PrimaryButton onClick={handleCloseDialog}>
                    סגירה
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    )
}

export default UserInfoDialog;

interface Props {
    open: boolean;
    defaultValues: SignUpUser;
    handleCloseDialog: () => void;
}
