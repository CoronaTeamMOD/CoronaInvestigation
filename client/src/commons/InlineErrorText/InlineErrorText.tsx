import React from 'react'
import {Typography} from '@material-ui/core'; 

import useStyles from './inlineErrorTextStyles';

const InlineErrorText = (props: Props) => {
    const { error } = props;
    const classes = useStyles();

    return (
        <>
            {error && <Typography className={classes.text}>*{error.message}</Typography>}
        </>
    )
}

interface Props {
    error? : {
        type: string,
        message?: string | undefined,
    };    
}

export default InlineErrorText;
