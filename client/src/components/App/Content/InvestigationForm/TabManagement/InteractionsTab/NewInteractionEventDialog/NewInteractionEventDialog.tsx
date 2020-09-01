import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Select, MenuItem } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import useFormStyles from 'styles/formStyles';
import DatePick from 'commons/DatePick/DatePick';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InteractionEventVariables from 'models/InteractionEventVariables';

import useStyles from './NewInteractionEventDialogStyles';


export interface Props {
    isOpen: boolean,
    eventId: number,
    onCancle: (eventId: number) => void;
    onCreateEvent: (interactionEventVariables: InteractionEventVariables) => void;
}

const selectData = [
    'מקום 1',
    'מקום 2',
    'מקום 3',
    'מקום 4',
    'מקום 5'
]

const defaultTime : string = '00:00';

const newConactEventTitle = 'יצירת מקום/מגע חדש'

const NewInteractionEventDialog : React.FC<Props> = (props: Props) : JSX.Element => {
    
    const { isOpen, eventId, onCancle, onCreateEvent } = props;

    const classes = useStyles();
    const formClasses = useFormStyles();

    const [canCreateEvent, setCanCreateEvent] = React.useState<boolean>(false);
    const [placeType, setPlaceType] = React.useState<string>(selectData[0]);
    const [eventStartTime, setEventStartTime] = React.useState<string>();
    const [eventEndTime, setEventEndTime] = React.useState<string>();
    const [canBeExported, setCanBeExported] = React.useState<boolean>(false);

    React.useEffect(() => {
        setCanCreateEvent(eventStartTime !== undefined && eventEndTime !== undefined);
    }, [eventStartTime, eventEndTime]);

    const onPlaceTypeChange = (event: React.ChangeEvent<any>) => setPlaceType(event.target.value);
    const onEventStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.target.value);
    const onEventEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => setEventEndTime(event.target.value);
    const onCanBeExportedChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, val: boolean) => setCanBeExported(val);

    return (
        <Dialog classes={{paper: classes.dialogPaper}} open={isOpen} maxWidth={false}>
            <DialogTitle className={classes.dialogTitleWrapper}>
                {newConactEventTitle}
            </DialogTitle>
            <DialogContent>
                <Grid className={formClasses.form} container justify='flex-start'>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                סוג אתר:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Select
                                value={placeType}
                                onChange={onPlaceTypeChange}
                                className={classes.placeTypeSelect}
                            >
                                {
                                    selectData.map((placeName: string) => (
                                        <MenuItem key={placeName} value={placeName}>{placeName}</MenuItem>
                                    ))
                                }
                            </Select>
                        </Grid>
                    </div>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                משעה:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <DatePick 
                                datePickerType='time'
                                value={eventStartTime || defaultTime}
                                onChange={onEventStartTimeChange}
                            />
                        </Grid>
                    </div>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                עד שעה:
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <DatePick 
                                datePickerType='time' 
                                value={eventEndTime || defaultTime}
                                onChange={onEventEndTimeChange}/>
                        </Grid>
                    </div>
                    <div className={formClasses.rowDiv}>
                        <Grid item xs={3}>
                            <Typography variant='caption' className={formClasses.fieldName}>
                                האם מותר להחצנה?
                            </Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Toggle 
                                className={classes.toggle}
                                value={canBeExported} 
                                onChange={onCanBeExportedChange}/>
                        </Grid>
                    </div>
                </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button 
                    onClick={() => onCancle(eventId)} 
                    color='default' 
                    className={classes.cancleButton}>
                    בטל
                </Button>
                <PrimaryButton 
                    disabled={!canCreateEvent}
                    onClick={() => onCreateEvent({canBeExported, eventEndTime, eventStartTime, placeType})}>
                    צור מקום/מגע
                </PrimaryButton>
            </DialogActions>
        </Dialog>
    );
};

export default NewInteractionEventDialog;