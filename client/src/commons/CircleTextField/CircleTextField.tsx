import React from 'react';
import { TextField, StandardTextFieldProps } from '@material-ui/core';

import { useStyles } from './CircleTextFieldStyles';

const CircleTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    return (
        <TextField
            {...props}
            variant='outlined'
            size='small'
<<<<<<< HEAD
            InputProps={{className: classes.borderRadius, classes:{input: classes.resize}}}
            InputLabelProps={{className: classes.resize}}
=======
            InputProps={{className: classes.borderRadius, classes: {input: classes.label}}}
            InputLabelProps={{className: classes.label}}
>>>>>>> 678d8affbf0f8579b483442bd51c46e5cd75c7ff
        />
    );
};

export default CircleTextField;

interface Props extends StandardTextFieldProps {
};
