import React from 'react';
import {Select, SelectProps} from '@material-ui/core';
import {useStyles} from './RoundedSelectStyles';

interface Props extends SelectProps {}

const RoundedSelect = (props:Props) => {
    const classes = useStyles();
    return (
        <Select variant='outlined'
                className={classes.selectInput}
                {...props}>
            {props.children}
        </Select>
    );
};

export default RoundedSelect;