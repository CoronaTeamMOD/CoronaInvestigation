import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Dialog, DialogTitle, Typography, DialogContent, Select, MenuItem } from '@material-ui/core';


import useStyles from './NewContactEventStyles';

export interface Props {
    isOpen: boolean
}

const newConactEventTitle = 'יצירת מקום/מגע חדש'

const selectData = [
    'מקום 1',
    'מקום 2',
    'מקום 3',
    'מקום 4',
    'מקום 5'
]

const NewConactEvent = (props: Props) => {

    const classes = useStyles({});

    const { isOpen } = props;

    const [contactEvent, setContactEvent] = React.useState<string>(selectData[0]);

    const handleChange = (event: any) => {
        setContactEvent(event.target.value);
    };

    return (
        <Dialog open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitle}>
                <Typography variant='h6'>
                    {newConactEventTitle}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <div className={classes.dialogContent}>
                    <div className={classes.rowDiv}>
                    <Typography variant='subtitle1' className={classes.place}>
                        סוג אתר:
                    </Typography>
                    <Select
                        value={contactEvent}
                        onChange={handleChange}
                        className={classes.placeSelect}
                    >
                        {
                            selectData.map((placeName: string) => (
                                <MenuItem value={placeName}>{placeName}</MenuItem>
                            ))
                        }
                    </Select>
                    </div>
                    <div className={classes.rowDiv}>
                    <Typography variant='subtitle1' className={classes.place}>
                        משעה:
                    </Typography>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={new Date()}
                        onChange={() => {}}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
                    </MuiPickersUtilsProvider>
                    </div>
                    <div className={classes.rowDiv}>
                    <Typography variant='subtitle1' className={classes.place}>
                        עד שעה:
                    </Typography>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewConactEvent;