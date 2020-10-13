import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './SignUpStyles'
import SignUpForm from './SignUpForm/SignUpForm'

const signUpTitle = 'הגדרת משתמש חדש'

const SignUp : React.FC<Props> = ({ open, handleSaveUser, handleCloseSignUp }) => {
    const classes = useStyles();

    return (
        <Dialog open={open} maxWidth='sm' fullWidth={true}>
            <DialogTitle>
                {signUpTitle}
                <IconButton test-id='closeSignUpForm' aria-label="close" className={classes.closeButton} onClick={handleCloseSignUp}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <SignUpForm handleSaveUser={handleSaveUser}/>
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