import React from 'react'
import { Card, IconButton, TextField, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import { StatusFilter as StatusFilterType } from '../InvestigationTableInterfaces';
import useStyles from './StatusFilterStyles';

interface Props {
    statuses: InvestigationMainStatus[];
    filteredStatuses: StatusFilterType;
    onStatusChange: (event: React.ChangeEvent<{}>, selectedStatuses: InvestigationMainStatus[]) => void;
    onClose: () => void;
}

const StatusFilter = ({ statuses, filteredStatuses, onStatusChange, onClose }: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <Typography>
                סינון לפי סטטוס:&nbsp;
            </Typography>
            <Autocomplete
                className={classes.autocomplete}
                size='small'
                disableCloseOnSelect
                multiple
                options={statuses}
                value={statuses.filter(status => filteredStatuses.includes(status.id))}
                getOptionLabel={(option) => option.displayName}
                onChange={onStatusChange}
                renderInput={(params) =>
                    <TextField
                        {...params}
                    />
                }
                limitTags={2}
            />
            <IconButton onClick={() => onClose()}><Close /></IconButton>
        </Card>
    )
}

export default StatusFilter
