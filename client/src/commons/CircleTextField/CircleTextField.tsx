import React from 'react';
import { TextField } from '@material-ui/core';

import { useStyles } from './CircleTextFieldStyles';

const CircleTextField: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { id, placeholder, size, select, className } = props;

    return (
        <TextField select={select} id={id} placeholder={placeholder} variant='outlined' size={size} InputProps={{className: classes.borderRadius, classes: {input: classes.resize}}} className={className}/>
    );
};

export default CircleTextField;

interface Props {
    id: string,
    placeholder?: string,
    size: "medium" | "small" | undefined,
    select?: boolean,
    className?: string
};