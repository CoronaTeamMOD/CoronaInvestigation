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
            <Typography>סינון לפי</Typography>
            <Typography>סטטוס:</Typography>
            <Autocomplete
                classes={{ inputRoot: classes.autocompleteInput }}
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
                renderTags={(tags) => {
                    const additionalTagsAmount = tags.length - 1;
                    const additionalDisplay = additionalTagsAmount > 0 ? ` (+${additionalTagsAmount})` : '';
                    return tags[0].displayName + additionalDisplay;
                }}
            />
            <IconButton onClick={() => onClose()}><Close /></IconButton>
        </Card>
    )
}

export default StatusFilter
