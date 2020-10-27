import React from 'react'
import { useSelector } from 'react-redux';
import { Close } from '@material-ui/icons';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@material-ui/core';

import SignUpFields from 'models/enums/SignUpFields';
import SignUpUser from 'models/SignUpUser';
import FormMode from 'models/enums/FormMode';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import StoreStateType from 'redux/storeStateType';

import useStyles from './SignUpStyles'
import UserPropertiesForm from './UserProperties/UserPropertiesForm';

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

    const [isFormValid, setIsFormValid] = React.useState<boolean>(false);

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
                <UserPropertiesForm 
                    defaultValues={defaultValues}
                    handleSaveUser={handleSaveUser}
                    setIsFormValid={setIsFormValid}
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
                    disabled={!isFormValid}
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