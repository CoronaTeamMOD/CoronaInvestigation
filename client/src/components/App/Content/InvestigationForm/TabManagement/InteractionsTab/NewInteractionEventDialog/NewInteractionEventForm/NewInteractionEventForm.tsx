import React from 'react';
import { Grid, Typography, Select, MenuItem } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import DatePick from 'commons/DatePick/DatePick';

import useStyles from './NewInteractionEventFormStyles';

const selectData = [
    'מקום 1',
    'מקום 2',
    'מקום 3',
    'מקום 4',
    'מקום 5'
]

export interface Props {
    setCanConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

const NewInteractionEventForm : React.FC<Props> = (props: Props) : JSX.Element => {

    const { setCanConfirm } = props;

    const classes = useStyles({});

    const [placeType, setPlaceType] = React.useState<string>(selectData[0]);
    const [eventStartTime, setEventStartTime] = React.useState<string>();
    const [eventEndTime, setEventEndTime] = React.useState<string>();
    const [canBeExported, setCanBeExported] = React.useState<boolean>(false);

    React.useEffect(() => {
        setCanConfirm(eventStartTime !== undefined && eventEndTime !== undefined);
    }, [eventStartTime, eventEndTime]);

    return (
        <Grid className={classes.form} container justify='flex-start'>
            <div className={classes.rowDiv}>
                <Grid item xs={3}>
                    <Typography variant='caption' className={classes.fieldName}>
                        סוג אתר:
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <Select
                        value={placeType}
                        onChange={(event: React.ChangeEvent<any>) => setPlaceType(event.target.value)}
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
            <div className={classes.rowDiv}>
                <Grid item xs={3}>
                    <Typography variant='caption' className={classes.fieldName}>
                        משעה:
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <DatePick 
                        datePickerType='time'
                        value={eventStartTime || '00:00'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventStartTime(event.target.value as string)}
                    />
                </Grid>
            </div>
            <div className={classes.rowDiv}>
                <Grid item xs={3}>
                    <Typography variant='caption' className={classes.fieldName}>
                        עד שעה:
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <DatePick 
                        datePickerType='time' 
                        value={eventEndTime || '00:00'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEventEndTime(event.target.value)}/>
                </Grid>
            </div>
            <div className={classes.rowDiv}>
                <Grid item xs={3}>
                    <Typography variant='caption' className={classes.fieldName}>
                        האם מותר להחצנה?
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <Toggle 
                        className={classes.toggle}
                        value={canBeExported} 
                        onChange={(event, val) => setCanBeExported(val)}/>
                </Grid>
            </div>
        </Grid>
    );
};

export default NewInteractionEventForm;