import React, { useEffect } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import useStyles from './AgeRangeStyle';

const AgeRangeFields: React.FC<Props> = (props: Props): JSX.Element => {

    const { id, minAge, maxAge, minAgeChanged, maxAgeChanged } = props;
    const classes = useStyles();

    return (
        <Grid item container alignItems='center' xs={12} spacing={1} id={id} direction='row' className={classes.mainRow}>
            <Grid item xs={6}>
                <TextField
                    {...props}
                    className={classes.numberField}
                    name='minAge'
                    type='number'
                    value={minAge}
                    onChange={(event) => {
                        minAgeChanged(event.target.value);
                    }}
                />
            </Grid>
            <Grid item xs='auto'>
                <Typography align='center'>עד</Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    className={classes.numberField}
                    name='maxAge'
                    type='number'
                    value={maxAge}
                    onChange={(event) => {
                        maxAgeChanged(event.target.value);

                    }}
                />
            </Grid>
        </Grid>
    );
};

interface Props {
    id?: string;
    minAge?: Number | null;
    maxAge?: Number | null;
    minAgeChanged: (event: any) => void;
    maxAgeChanged: (event: any) => void;
};

export default AgeRangeFields;