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
            <Typography variant='h6'>הדסקים בהם הנך צופה כעת:</Typography>
            <Autocomplete
                className={classes.autocomplete}
                disableCloseOnSelect
                multiple
                options={desks}
                value={desks.filter(desk => filteredDesks.includes(desk.id))}
                getOptionLabel={(option) => option.deskName}
                onChange={onDeskChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                    />
                }
                renderTags={(tags: Desk[]) => {
                    const additionalTagsAmount = tags.length - 1;
                    const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                    return tags[0].deskName + additionalDisplay;
                }}
            />
        </Card>
    )
}

export default DeskFilter
