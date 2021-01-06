import React from 'react'
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { Card, Checkbox, IconButton, TextField, Typography } from '@material-ui/core';

import InvestigationMainStatus from 'models/InvestigationMainStatus';

import useStyles from './TableFilterStyles';
import { StatusFilter as StatusFilterType } from '../InvestigationTableInterfaces';

interface Props {
    statuses: InvestigationMainStatus[];
    filteredStatuses: StatusFilterType;
    unassignedUserFilter: boolean;
    inactiveUserFilter: boolean;
    changeUnassginedUserFilter: (isFilterOn: boolean) => void;
    changeInactiveUserFilter: (isFilterOn: boolean) => void;
    onFilterChange: (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => void;
    onClose: () => void;
}

const TableFilter = (props: Props) => {
    const classes = useStyles();

    const { statuses, filteredStatuses, onFilterChange, onClose, changeInactiveUserFilter, changeUnassginedUserFilter, inactiveUserFilter, unassignedUserFilter } = props;

    return (
        <Card className={classes.card}>
            <Typography className={classes.title} >
                <b>סינון לפי סטטוס</b>
            </Typography>
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
                <b>חקירות לא משויכות</b>
            </Typography>
            <Checkbox
                onChange={(event) => changeInactiveUserFilter(event.target.checked)}
                color='primary'
                checked={inactiveUserFilter}
            />
            <Typography className={classes.title} >
                <b>חקירות משויכות לחוקרים לא פעילים</b>
            </Typography>
            <IconButton onClick={() => onClose()} size='small'><Close /></IconButton>
        </Card>
    )
}

export default TableFilter
