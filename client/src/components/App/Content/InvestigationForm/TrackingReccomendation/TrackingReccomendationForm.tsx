import React, { useState, useEffect } from 'react'
import { Grid , Collapse, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';
import { setTrackingReccomendation } from 'redux/Investigation/investigationActionCreators';

import useStyles from './trackingReccomendationStyles';
import { Option } from './trackingReccomendationTypes';
import UseTrackingReccomendationForm from './useTrackingReccomendationForm';

const otherSubReason = 99;
const defaultTrackingReason = 0;
const trackingOptions = [
    { id: defaultTrackingReason , displayName: 'ללא המלצה לאיתור מגעים ממוכן'},
    { id: 1 , displayName: 'המלצה לאיתר מגעים ממוכן'},
    { id: 2 , displayName: 'אין צורך באיתור מגעים ממוכן'}
];


const TrackingReccomendationForm = (props: Props) => {
    const classes = useStyles();

    const [trackingSubReasons, setTrackingSubReasons] = useState<Option[]>([]);
    const [trackingReason, setTrackingReason] = useState<number | null>(defaultTrackingReason) 
    const [trackingSubReason, setTrackingSubReason] = useState<number>(0);
    const [extraInfo , setExtraInfo] = useState<string>('');

    const { fetchSubReasonsByReason } = UseTrackingReccomendationForm({});

    useEffect(() => {
        const fetchSubReasonsByReasonAsync = async () => {
            trackingReason !== null && setTrackingSubReasons(await fetchSubReasonsByReason(trackingReason));
        };
        fetchSubReasonsByReasonAsync();
    }, [trackingReason]);

    return (
        <Grid container className={classes.container}>
            <Grid item>
            <FormControl variant='outlined'>
                <Select
                    defaultValue={defaultTrackingReason}
                    onChange={async (e) => {
                        const newReason : number = e.target.value as number;
                        setTrackingReason(newReason)
                        setTrackingReccomendation({
                            reason: newReason,
                        });
                        
                    }}
                >
                    {trackingOptions.map(
                        option => (
                            <MenuItem key={option.id} value={option.id ?? 0}>
                                {option.displayName}
                            </MenuItem>
                        )
                    )}
                </Select>
            </FormControl>
            </Grid>
            <Collapse in={trackingReason !== defaultTrackingReason}>
                <Grid item>
                    <FormControl variant='outlined'>
                    <InputLabel>סיבה</InputLabel>
                    <Select
                        onChange={(e) => {
                            setTrackingSubReason(e.target.value as number)
                            setTrackingReccomendation({
                                reason: trackingReason,
                                subReason: e.target.value as number
                            });
                            setExtraInfo('');
                        }}
                    >
                        {trackingSubReasons.map(subReason => (
                            <MenuItem key={subReason.id} value={subReason.id}>
                                {subReason.displayName}
                            </MenuItem>
                        ))}    
                    </Select>
                    </FormControl>
                </Grid>
            </Collapse>
            <Collapse in={trackingSubReason === otherSubReason}>
                <Grid item>
                    <FormControl variant='outlined'>
                        <AlphanumericTextField
                            name='trackingExtraInfo'
                            value={extraInfo}
                            onChange={(value) => {
                                setExtraInfo(value);
                                setTrackingReccomendation({
                                    reason: trackingReason,
                                    subReason: trackingSubReason,
                                    extraInfo: value
                                });
                            }}
                        />
                    </FormControl>
                </Grid>
            </Collapse>
        </Grid>
    )
}

interface Props {
    
}

export default TrackingReccomendationForm
