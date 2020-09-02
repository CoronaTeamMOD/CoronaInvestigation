import React from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { Typography, TextField, StandardTextFieldProps } from '@material-ui/core';

import { useStyles } from './DatePickStyles';

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { lableText, lableTextVariant, type, ...rest } = props;

    return (
        <div className={classes.dateField}>
            {
                lableText && <Typography variant={lableTextVariant}>
                    <b>{lableText + ':'}</b>
                </Typography>
            }
            <div className={classes.dateText}>
                <TextField
                    id={type}
                    type={type}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    {...rest}
                />
            </div>
        </div>
    );
};

export default DatePick;

interface Props extends StandardTextFieldProps {
    lableText?: string;
    lableTextVariant?: Variant
};
