import React from 'react';
import { TextField, StandardTextFieldProps } from '@material-ui/core';

import { useStyles } from './CircleTextFieldStyles';

const CircleTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    return (
        <TextField
            {...props}
            variant='outlined'
            InputProps={{className: classes.borderRadius}}
        />
    );
};

export default CircleTextField;

interface Props extends StandardTextFieldProps {
};
