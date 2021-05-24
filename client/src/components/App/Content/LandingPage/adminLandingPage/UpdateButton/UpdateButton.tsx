import React from 'react';
import { Button } from '@material-ui/core';

import useStyles from './UpdateButtonStyles';

const UpdateButton = (props : Props): JSX.Element => {
    
    const classes = useStyles();
    
    const { onClick, id, text, disabled } = props;
    
    return (
        <Button
            className={classes.updateButton}
            variant='contained'
            size='small'
            id={id}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </Button>
    )
};

interface Props {
    onClick? : () => void;
    id?: string;
    text?: string;
    disabled?: boolean;
};

export default UpdateButton;