import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import SignUpFields from 'models/enums/SignUpFields'
import SignUpUser from 'models/SignUpUser';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import SignUpForm from '../../SignUp/SignUpForm/SignUpForm'
import useStyles from '../../SignUp/SignUpStyles'

const UserInfoDialog: React.FC<Props> = ({ open, defaultValues, handleCloseDialog }: Props) => {
    const userInfoTitle = defaultValues[SignUpFields.MABAR_USER_NAME]

    const classes = useStyles();

    return (
        <Dialog open={open} maxWidth='sm' fullWidth={true}>
            <DialogTitle>
                {userInfoTitle}
                <IconButton test-id='closeSignUpForm' aria-label="close" className={classes.closeButton} onClick={handleCloseDialog}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <SignUpForm defaultValues={defaultValues} />
            </DialogContent>

            <DialogActions>
                <PrimaryButton onClick={handleCloseDialog}>
                    סגירה
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    )
}

interface Props {
    open: boolean;
    defaultValues: SignUpUser;
    handleCloseDialog: () => void;
}

export default UserInfoDialog