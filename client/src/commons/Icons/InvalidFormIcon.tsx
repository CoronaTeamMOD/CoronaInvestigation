import React from 'react'
import { Tooltip } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import theme from 'styles/theme';

const invalidFormErrorText = 'ישנם שדות לא תקינים';

const InvalidFormIcon = () => {
    return (
        <Tooltip title={invalidFormErrorText} arrow>
            <ErrorOutlineIcon style={{ color : theme.palette.error.main}}/>
        </Tooltip>
    )
}

export default InvalidFormIcon;
