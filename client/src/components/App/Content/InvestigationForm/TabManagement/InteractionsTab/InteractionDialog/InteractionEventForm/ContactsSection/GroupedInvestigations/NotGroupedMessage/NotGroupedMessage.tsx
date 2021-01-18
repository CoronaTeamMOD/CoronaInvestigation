import { Typography } from '@material-ui/core'
import React from 'react'

const notGroupedText = 'החקירה אינה מקובצת';

const NotGroupedMessage = () => {
    return (
        <Typography variant='h5'>
            {notGroupedText}
        </Typography>
    )
}

export default NotGroupedMessage;
