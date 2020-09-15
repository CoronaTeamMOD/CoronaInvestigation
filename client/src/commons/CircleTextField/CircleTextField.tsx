import React from 'react';
import {TextField, StandardTextFieldProps} from '@material-ui/core';

import {useStyles} from './CircleTextFieldStyles';

const CircleTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    return (
        <TextField
            {...props}
            label={props.required && "שדה חובה"}
            variant='outlined'
            size='small'
            InputProps={{
                ...props.InputProps,  className: classes.borderRadius, classes: {input: classes.label},
            }}
            InputLabelProps={{className: classes.label, shrink: true}}
        />
    );
};

export default CircleTextField;

export interface Props extends StandardTextFieldProps {
};
