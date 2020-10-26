import React from 'react';
import {Snackbar, Button, IconButton} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import useStyles from './RefreshSnackbarStyles';

const refreshText = 'רענון';

const RefreshSnackbar = ({isOpen, onClose, onOk, message}: Props) => {
    const classes = useStyles();

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={isOpen}
                onClose={handleClose}
                message={
                    <>
                        <IconButton size='small' color='inherit' onClick={handleClose}>
                            <Close fontSize='small' />
                        </IconButton>
                        {message}
                    </>
                }
                action={
                    <Button className={classes.button}
                        variant='contained'
                        onClick={onOk}>
                        {refreshText}
                    </Button>
                }
            />
    );
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onOk: () => void;
    message: string;
}

export default RefreshSnackbar;