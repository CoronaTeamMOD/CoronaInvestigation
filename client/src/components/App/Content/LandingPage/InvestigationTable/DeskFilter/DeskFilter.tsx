import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, TextField, Typography } from '@material-ui/core';

import Desk from 'models/Desk';

import useStyles from './DeskFilterStyles';

const DeskFilter = ({ desks, filteredDesks, onFilterChange }: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <Typography variant='body2'>הדסקים בהם הנך צופה כעת:</Typography>
            <Autocomplete
                className={classes.autocomplete}
                disableCloseOnSelect
                multiple
                size='small'
                options={desks}
                value={desks.filter(desk => filteredDesks.includes(desk.id))}
                getOptionLabel={(option) => option.deskName}
                onChange={onFilterChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        className={classes.textfield}
                    />
                }
                renderOption={(option, { selected }) => (
                    <>
                        <Checkbox
                            size='small'
                            color='primary'
                            className={classes.optionCheckbox}
                            checked={selected}
                            color='primary'
                        />
                        <Typography variant='body2'>{option.deskName}</Typography>
                    </>
                )}
                limitTags={1}
            />
        </Card>
    )
}

export default DeskFilter;

interface Props {
    desks: Desk[];
    filteredDesks: number[];
    onFilterChange: (event: React.ChangeEvent<{}>, selectedDesks: Desk[]) => void;
};
