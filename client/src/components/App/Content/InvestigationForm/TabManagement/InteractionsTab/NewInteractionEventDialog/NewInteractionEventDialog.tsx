import React from 'react';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Select, MenuItem, Button } from '@material-ui/core';

import useStyles from './InteractionEventDialogStyles';

export interface Props {
    isOpen: boolean,
}

const newConactEventTitle = 'יצירת מקום/מגע חדש'

const selectData = [
    'מקום 1',
    'מקום 2',
    'מקום 3',
    'מקום 4',
    'מקום 5'
]

const InteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {

    const classes = useStyles({});

    const [contactEvent, setContactEvent] = React.useState<string>(selectData[0]);

    const handleChange = (event: any) => {
        setContactEvent(event.target.value);
    };

    const { isOpen } = props;

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitle}>
                <Typography variant='h6'>{newConactEventTitle}</Typography>
            </DialogTitle>
            <DialogContent>
                <div className={classes.dialogContent}>
                    <div className={classes.rowDiv}>
                        <Typography variant='subtitle1' className={classes.fieldName}>
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
                        <Typography variant='subtitle1' className={classes.fieldName}>
                            משעה:
                        </Typography>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                        </MuiPickersUtilsProvider> */}
                        </div>
                        <div className={classes.rowDiv}>
                            <Typography variant='subtitle1' className={classes.fieldName}>
                                עד שעה:
                            </Typography>
                        </div>
                </div>
            </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => {}} 
                    color='default' 
                    className={classes.cancleButton}>
                    בטל
                </Button>
                <Button variant='contained'
                    color='primary'
                    className={classes.addEventButton}
                    onClick={() => {}}>
                    צור מקום/מגע
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InteractionEventDialog;