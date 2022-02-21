import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import { Checkbox, TextField, Typography } from '@material-ui/core';

import Desk from 'models/Desk';

import useStyles from './DeskFilterStyles';

const DeskFilter = ({ desks, filteredDesks, onFilterChange }: Props) => {
    const classes = useStyles();
    const isNoSelectedDesks = desks.filter(desk => filteredDesks.includes(desk.id))
    return (
        <Autocomplete
            ChipProps={{className:classes.chip}}
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
                    label={isNoSelectedDesks[0] == null ? 'כל הדסקים' : ''}
                    {...params}
                    InputProps={{ ...params.InputProps, className: classes.autocompleteInput }}
                    size='small'
                />
            }
            renderOption={(option, { selected }) => (
                <>
                    <Checkbox
                        size='small'
                        color='primary'
                        className={classes.optionCheckbox}
                        checked={selected}
                    />
                    <Typography variant='body2'>{option.deskName}</Typography>
                </>
            )}
            limitTags={1}
        />
    )
}

export default DeskFilter;

interface Props {
    desks: Desk[];
    filteredDesks: (number | null)[];
    onFilterChange: (event: React.ChangeEvent<{}>, selectedDesks: Desk[]) => void;
};
