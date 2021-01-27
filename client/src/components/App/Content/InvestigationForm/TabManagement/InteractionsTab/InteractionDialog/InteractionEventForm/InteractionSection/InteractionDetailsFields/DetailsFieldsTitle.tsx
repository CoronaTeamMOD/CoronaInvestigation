import React from 'react';
import {Typography} from '@material-ui/core';

const dateFormatSettings = { weekday: 'short', day: 'numeric',month: 'numeric',year: 'numeric' };
const DetailsFieldsTitle = ({date}: Props) => {
    return (
        <Typography variant='body1'>
            <b>{date.toLocaleDateString('he-IL', dateFormatSettings)}</b>
        </Typography>
    );
};

interface Props{
    date: Date;
}

export default DetailsFieldsTitle;