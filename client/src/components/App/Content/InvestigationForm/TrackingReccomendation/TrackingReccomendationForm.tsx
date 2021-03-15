import React, { useState } from 'react'
import { Grid , Collapse, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';

import { Option } from './trackingReccomendationTypes';
import UseTrackingReccomendationForm from './useTrackingReccomendationForm';

const trackingOptions = [
    { id: 0 , displayName: 'ללא המלצה לאיתור מגעים ממוכן'},
    { id: 1 , displayName: 'המלצה לאיתר מגעים ממוכן'},
    { id: 2 , displayName: 'אין צורך באיתור מגעים ממוכן'}
]

const defaultTrackingReason = 0;

const TrackingReccomendationForm = (props: Props) => {
    const [trackingSubReasons, setTrackingSubReasons] = useState<Option[]>([]);
    const [trackingReason, setTrackingReason] = useState<number>(defaultTrackingReason) 
    const [trackingSubReason, setTrackingSubReason] = useState<number>(0);
    const [extraInfo , setExtraInfo] = useState<string>('');

    const { fetchSubReasons } = UseTrackingReccomendationForm({});
    return (
        <Grid container>
            <Grid item>
            <FormControl variant='outlined'>
                <Select
                    defaultValue={defaultTrackingReason}
                    onChange={(e) => {
                        setTrackingReason(e.target.value as number)
                        setTrackingSubReasons(fetchSubReasons());
                    }}
                >
                    {trackingOptions.map(
                        option => (
                            <MenuItem key={option.id} value={option.id}>
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
                            setExtraInfo('');
                        }}
                    >
                        {trackingSubReasons.map( subReason => (
                            <MenuItem key={subReason.id} value={subReason.id}>
                                {subReason.displayName}
                            </MenuItem>
                        ))}    
                    </Select>
                    </FormControl>
                </Grid>
            </Collapse>
            <Collapse in={trackingSubReason !== 0}>
                <Grid item>
                    <FormControl variant='outlined'>
                        <AlphanumericTextField
                            name='trackingExtraInfo'
                            value={extraInfo}
                            onChange={(value) => {
                                setExtraInfo(value);
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
