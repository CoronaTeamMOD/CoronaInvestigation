import React from 'react';

import { Typography, TextField } from '@material-ui/core';

import { useStyles } from './DatePickStyles';

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});

    const { text } = props;

    return (
        <div className={classes.dateField}>
            <Typography>
                <b>{text + ':'}</b>
            </Typography>
            <div className={classes.dateText}>
                <TextField
                    id='date'
                    type='date'
                    className={classes.textField}
                    defaultValue='2017-05-24'
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </div>
        </div>
    );
};

export default DatePick;

interface Props {
    text: string;
};
