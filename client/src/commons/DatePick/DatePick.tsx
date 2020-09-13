import React from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { Typography, StandardTextFieldProps  } from '@material-ui/core';

import CircleTextField from 'commons/CircleTextField/CircleTextField';

import { useStyles } from './DatePickStyles';

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { lableText, lableTextVariant, type, ...rest } = props;

    return (
        <div className={classes.dateField}>
            {
                lableText && <Typography className={classes.dateText}>
                    <b>{lableText + ':'}</b>
                </Typography>
            }
            <div className={classes.dateText}>
                <CircleTextField
                    test-id={props.testId}
                    id={type}
                    type={type}
                    className={classes.textField}
                    size='small'
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
    testId?: string; 
};
