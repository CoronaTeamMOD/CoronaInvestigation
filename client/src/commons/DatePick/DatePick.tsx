import React from 'react';

import { Typography, TextField, StandardTextFieldProps  } from '@material-ui/core';

import { useStyles } from './DatePickStyles';

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
                <TextField
                    id={datePickerType}
                    type={datePickerType}
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
    text?: string;
    datePickerType: 'date' | 'time';
};
