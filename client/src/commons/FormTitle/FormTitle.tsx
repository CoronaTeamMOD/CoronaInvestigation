import React from 'react';
import {Typography} from '@material-ui/core';
import useStyles from './FormTitleStyles';

interface Props {
    title: string;
}

const FormTitle = ({title}: Props) => {
    const classes = useStyles();

    return (
        <Typography variant='subtitle1' className={classes.title}>
            {title}
        </Typography>
    );
};

export default FormTitle;