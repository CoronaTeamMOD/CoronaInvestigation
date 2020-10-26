import React from 'react'
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import SignUpFields from 'models/enums/SignUpFields';
import SignUpUser from 'models/SignUpUser';
import FormMode from 'models/enums/FormMode';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import StoreStateType from 'redux/storeStateType';

import useStyles from './SignUpStyles'
import SignUpForm from './SignUpForm/SignUpForm'

const signUpTitle = 'הגדרת משתמש חדש';

const UserInitialValues: SignUpUser = {
    [SignUpFields.FULL_NAME] : {
        [SignUpFields.FIRST_NAME]: undefined,
        [SignUpFields.LAST_NAME]: undefined,
    },
}

const SignUp : React.FC<Props> = ({ open, handleSaveUser, handleCloseSignUp }) => {

    const classes = useStyles();

    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const defaultValues : SignUpUser = {
        ...UserInitialValues,
        [SignUpFields.MABAR_USER_NAME]: userId,
    }

    return (
        <Dialog open={open} maxWidth='sm' fullWidth={true}>
            <DialogTitle>
                {signUpTitle}
                <IconButton test-id='closeSignUpForm' aria-label="close" className={classes.closeButton} onClick={handleCloseSignUp}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <SignUpForm 
                    defaultValues={defaultValues}
                    handleSaveUser={handleSaveUser}
                    mode={FormMode.CREATE}
                />
            </DialogContent>

            <DialogActions>
                <Button
                    test-id='cancelSignUpForm'
                    onClick={handleCloseSignUp}
                >
                    ביטול
                </Button>
                <PrimaryButton
                    test-id='signUp'
                    form='signUp'
                    type='submit'
                >
                    שלח בקשה
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    )
}

interface Props {
    open: boolean;
    handleSaveUser: () => void;
    handleCloseSignUp: () => void;
}

export default SignUp;