import React from 'react';
import {Typography, TypographyProps, Grid, GridSize} from '@material-ui/core';

import useStyles from './FormInputStyles';
import useFormStyles from 'styles/formStyles';

const FormInput: React.FC<Props> = (props: Props): JSX.Element => {
    const formClasses = useFormStyles();
    const classes = useStyles();

    const { fieldName, children, labelLength, xs, className, isQuestion, ...rest } = props;

    return (
        <Grid container item alignItems='center'
               test-id={'textFormInput'} xs={xs} className={className || ''}>
            <Grid item className={classes.inputLabel} xs={labelLength ? labelLength : 3}>
                <Typography className={formClasses.fieldName} variant='caption' {...rest}>
                {fieldName && (isQuestion ? <b>{fieldName + '?'}</b> : <b>{fieldName + ':'}</b>)}
                </Typography>
            </Grid>
            <Grid item xs={labelLength ? (12-labelLength) as GridSize : 9}>
                {children}
            </Grid>
        </Grid>
    );
};

export default FormInput;

interface Props extends TypographyProps {
    xs?: GridSize;
    fieldName?: string;
    className?: string;
    children: JSX.Element | JSX.Element[];
    labelLength?: Exclude<GridSize, 'auto'>;
    isQuestion?: Boolean;
};