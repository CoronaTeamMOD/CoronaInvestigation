import React from 'react'
import { Card, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import Desk from 'models/Desk';

import useStyles from './DeskFilterStyles';

interface Props {
    desks: Desk[];
    filteredDesks: number[];
    onDeskChange: (event: React.ChangeEvent<{}>, selectedDesks: Desk[]) => void;
}

const DeskFilter = ({ desks, filteredDesks, onDeskChange }: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <Typography variant='subtitle1'>הדסקים בהם הנך צופה כעת:</Typography>
            <Autocomplete
                className={classes.autocomplete}
                disableCloseOnSelect
                multiple
                size='small'
                options={desks}
                value={desks.filter(desk => filteredDesks.includes(desk.id))}
                getOptionLabel={(option) => option.deskName}
                onChange={onDeskChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                    />
                }
                limitTags={2}
            />
        </Card>
    )
}

export default DeskFilter
