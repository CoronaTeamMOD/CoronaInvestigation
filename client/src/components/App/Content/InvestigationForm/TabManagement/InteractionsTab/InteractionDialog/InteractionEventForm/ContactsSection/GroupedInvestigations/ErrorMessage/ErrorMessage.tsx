import { Typography } from '@material-ui/core'
import React from 'react'

const notGroupedText = 'החקירה אינה מקובצת';

const NotGroupedMessage = (props : Props) => {
    const { text } = props;
    return (
        <Typography variant='h5'>
            {text}
        </Typography>
    )
}

interface Props{
    text : string;
}

export default NotGroupedMessage;
