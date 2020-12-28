import React from 'react';
import { Button } from '@material-ui/core';

import useStyles from './UpdateButtonStyles';

const UpdateButton: React.FC = (): JSX.Element => {
    const classes = useStyles();

    return (
        <Button
            className={classes.updateButton}
            variant='contained'
            size='small'>
            עדכון
        </Button>
    )
}

export default UpdateButton;
