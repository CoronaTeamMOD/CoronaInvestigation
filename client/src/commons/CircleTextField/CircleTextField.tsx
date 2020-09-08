import React from 'react';
import {TextField, StandardTextFieldProps} from '@material-ui/core';

import {useStyles} from './CircleTextFieldStyles';

const CircleTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    return (
        <TextField
            {...props}
            variant='outlined'
            size='small'
            InputProps={{
                ...props.InputProps,  className: classes.borderRadius, classes: {input: classes.label},
            }}
            InputLabelProps={{className: classes.label}}
        />
    );
};

export default CircleTextField;

interface Props extends StandardTextFieldProps {
};
