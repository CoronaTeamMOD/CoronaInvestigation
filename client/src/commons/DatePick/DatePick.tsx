import React from 'react';

import { Typography, StandardTextFieldProps  } from '@material-ui/core';

import { useStyles } from './DatePickStyles';
import CircleTextField from 'commons/CircleTextField/CircleTextField';

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { text, datePickerType, ...rest } = props;

    return (
        <div className={classes.dateField}>
            {
                text && <Typography>
                    <b>{text + ':'}</b>
                </Typography>
            }
            <div className={classes.dateText}>
                <CircleTextField
                    id={datePickerType}
                    type={datePickerType}
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
    text?: string;
    datePickerType: 'date' | 'time';
};
