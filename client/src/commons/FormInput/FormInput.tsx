import React from 'react';
import { Typography, TypographyProps, Grid } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';

const FormInput: React.FC<Props> = (props: Props): JSX.Element => {
    const formClasses = useFormStyles();

    const { fieldName, children, labelLength, ...rest } = props;

    return (
        <div test-id={'textFormInput'} className={formClasses.formField}>
            <Grid item xs={labelLength ? labelLength : 4}>
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
    labelLength?: "auto" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
};
