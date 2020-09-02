import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';

const FormInput: React.FC<Props> = (props: Props): JSX.Element => {
    const formClasses = useFormStyles();

    const { fieldName, children, ...rest } = props;

    return (
        <div className={formClasses.formField}>
            <Typography className={formClasses.fieldName} variant='caption' {...rest}>
                <b>{fieldName + ':'}</b>
            </Typography>
            {children}
        </div>
    );
};

export default FormInput;

interface Props extends TypographyProps {
    fieldName: string;
    children: JSX.Element;
};
