import React from 'react'
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, IconButton, TextField, Typography } from '@material-ui/core';

import InvestigationMainStatus from 'models/InvestigationMainStatus';

import useStyles from './TableFilterStyles';
import { StatusFilter as StatusFilterType } from '../InvestigationTableInterfaces';
import { TimeRange } from 'models/TimeRange';


const TableFilter = (props: Props) => {
    const classes = useStyles();

    const { 
        statuses, filteredStatuses, 
        onFilterChange, onClose, 
        changeInactiveUserFilter, inactiveUserFilter, 
        changeUnassginedUserFilter, unassignedUserFilter, 
        timeRangeFilter, onTimeRangeFilterChange
    } = props;

    return (
        <Card className={classes.card}>
            <Autocomplete
                ChipProps={{className:classes.chip}}
                className={classes.autocomplete}
                size='small'
                disableCloseOnSelect
                multiple
                options={statuses}
                value={statuses.filter(status => filteredStatuses.includes(status.id))}
                getOptionLabel={(option) => option.displayName}
                onChange={onFilterChange}
                renderInput={(params) =>
                    <TextField
                        size='small'
                        label='סינון לפי סטטוס'
                        {...params}
                    />
                }
                renderOption={(option, { selected }) => (
                    <>
                        <Checkbox
                            size='small'
                            className={classes.optionCheckbox}
                            checked={selected}
                            color='primary'
                        />
                        <Typography className={classes.option} >{option.displayName}</Typography>
                    </>
                )}
                limitTags={1}
            />
            <Checkbox
                onChange={(event) => changeUnassginedUserFilter(event.target.checked)}
                color='primary'
                checked={unassignedUserFilter}
            />
            <Typography className={classes.title} >
                חקירות לא משויכות
            </Typography>
            <Checkbox
                onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                color='primary'
                checked={inactiveUserFilter}
            />
            <Typography className={classes.title} >
                חקירות משויכות לחוקרים לא פעילים
            </Typography>
            <IconButton onClick={() => onClose()} size='small'><Close /></IconButton>
        </Card>
    )
}

interface Props {
    statuses: InvestigationMainStatus[];
    filteredStatuses: StatusFilterType;
    unassignedUserFilter: boolean;
    inactiveUserFilter: boolean;
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    onFilterChange: (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => void;
    onClose: () => void;
    timeRangeFilter: TimeRange;
    onTimeRangeFilterChange: (event: React.ChangeEvent<{}>, timeRangeFilter: TimeRange) => void;
};

export default TableFilter
