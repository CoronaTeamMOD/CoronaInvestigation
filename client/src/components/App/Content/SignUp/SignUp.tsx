import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@material-ui/core';
import { Close } from '@material-ui/icons';

import SignUpUser from 'models/SignUpUser';
import SignUpFields from 'models/enums/SignUpFields';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './SignUpStyles'
import SignUpForm from './SignUpForm/SignUpForm'


const SignUp : React.FC<Props> = ({ open, defaultValue, handleSaveUser, handleCloseSignUp }) => {
    const signUpTitle = defaultValue ? defaultValue[SignUpFields.MABAR_USER_NAME] : 'הגדרת משתמש חדש';

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
                <SignUpForm defaultValue={defaultValue} handleSaveUser={handleSaveUser}/>
            </DialogContent>

            <DialogActions>
               { defaultValue ? 
                <PrimaryButton onClick={handleCloseSignUp}>
                    סגירה
                </PrimaryButton>
                :
                <>
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
                </>
               } 
            </DialogActions>
        </Dialog>
    )
}

interface Props {
    open: boolean;
    defaultValue?: SignUpUser;
    handleSaveUser?: () => void;
    handleCloseSignUp: () => void;
}

export default SignUp;