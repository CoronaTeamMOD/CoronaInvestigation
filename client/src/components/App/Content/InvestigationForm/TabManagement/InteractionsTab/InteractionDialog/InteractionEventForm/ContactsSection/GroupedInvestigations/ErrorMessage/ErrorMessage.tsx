import { Typography } from '@material-ui/core'
import React from 'react'

const NotGroupedMessage = (props : Props) => {
    const { text } = props;
    return (
        <Typography id="errorMessage" variant='h5'>
            {text}
        </Typography>
    )
}

interface Props{
    text : string;
}

export default NotGroupedMessage;
