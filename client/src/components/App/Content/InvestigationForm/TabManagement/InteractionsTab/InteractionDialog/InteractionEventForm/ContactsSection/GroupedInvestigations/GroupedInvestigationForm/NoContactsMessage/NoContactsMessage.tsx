import { Typography } from '@material-ui/core'
import React from 'react'
    
const message = 'אין מגעים לחקירות המשותפות';

const NoContactsMessage = () => {
    return (
        <Typography variant='h5'>
            {message}
        </Typography>
    )
}

export default NoContactsMessage;
