import React from 'react';
import { Button } from '@material-ui/core';

import useStyles from './UpdateButtonStyles';

interface Props {
    onClick? : () => void;
}

const UpdateButton = (props : Props): JSX.Element => {
    const classes = useStyles();
    const {onClick} = props;

    return (
        <Button
            className={classes.updateButton}
            variant='contained'
            size='small'
            onClick={onClick}
            >
            עדכון
        </Button>
    )
}

export default UpdateButton;
