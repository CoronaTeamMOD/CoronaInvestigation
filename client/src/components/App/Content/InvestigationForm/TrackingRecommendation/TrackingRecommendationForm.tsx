import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Grid , Collapse, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import TrackingRecommendation from 'models/TrackingRecommendation/TrackingRecommendation';
import AlphanumericTextField from 'commons/NoContextElements/AlphanumericTextField';
import { setTrackingRecommendation } from 'redux/Investigation/investigationActionCreators';
import { trackingOptions, defaultTrackingReason, otherSubReason } from 'models/TrackingRecommendation/trackingOptions';

import useStyles from './trackingRecommendationStyles';
import { Option } from './trackingRecommendationTypes';
import UseTrackingRecommendationForm from './useTrackingRecommendationForm';

const TrackingRecommendationForm = (props: Props) => {
    const trackingRecommendation = useSelector<StoreStateType, TrackingRecommendation>(state => state.investigation.trackingRecommendation);
    const classes = useStyles();
    const { reason, subReason, extraInfo } = trackingRecommendation;

    const [trackingSubReasons, setTrackingSubReasons] = useState<Option[]>([]);

    const { fetchSubReasonsByReason } = UseTrackingRecommendationForm({});

    useEffect(() => {
        const fetchSubReasonsByReasonAsync = async () => {
            reason !== null && setTrackingSubReasons(await fetchSubReasonsByReason(reason));
        };
        fetchSubReasonsByReasonAsync();
    }, [reason]);

    return (
        <Grid container className={classes.container}>
            <Grid item>
            <FormControl variant='outlined'>
                <Select
                    value={reason || 0}
                    onChange={async (e) => {
                        const newReason : number = e.target.value as number;
                        reason !== null && setTrackingSubReasons(await fetchSubReasonsByReason(reason));
                        setTrackingRecommendation({
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
            <Collapse in={reason !== defaultTrackingReason}>
                <Grid item>
                    {
                        trackingSubReasons.length > 0 && 
                        <FormControl variant='outlined'>
                            <InputLabel>סיבה</InputLabel>
                            <Select
                                value={subReason || 0}
                                onChange={(e) => {
                                    setTrackingRecommendation({
                                        reason,
                                        subReason: e.target.value as number
                                    });
                                }}
                            >
                                {trackingSubReasons.map(subReason => (
                                    <MenuItem key={subReason.id} value={subReason.id}>
                                        {subReason.displayName}
                                    </MenuItem>
                                ))}    
                            </Select>
                        </FormControl>
                    }
                </Grid>
            </Collapse>
            <Collapse in={subReason === otherSubReason}>
                <Grid item>
                    <FormControl variant='outlined'>
                        <AlphanumericTextField
                            name='trackingExtraInfo'
                            value={extraInfo || ''}
                            onChange={(value) => {
                                setTrackingRecommendation({
                                    reason,
                                    subReason: otherSubReason,
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

export default TrackingRecommendationForm;
