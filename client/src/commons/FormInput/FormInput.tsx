import React from 'react';
import { Typography, TypographyProps, Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';

const FormInput: React.FC<Props> = (props: Props): JSX.Element => {
    const formClasses = useFormStyles();

    const { fieldName, children, ...rest } = props;

    return (
        <div test-id={'textFormInput'} className={formClasses.formField}>
            <Grid item xs={4}>
                <Typography className={formClasses.fieldName} variant='caption' {...rest}>
                    <b>{fieldName + ':'}</b>
                </Typography>
            </Grid>
            <Grid item xs={8}>
                {children}
            </Grid>
        </div>
    );
};

export default FormInput;

interface Props extends TypographyProps {
    fieldName: string;
    children: JSX.Element | JSX.Element[];
};
