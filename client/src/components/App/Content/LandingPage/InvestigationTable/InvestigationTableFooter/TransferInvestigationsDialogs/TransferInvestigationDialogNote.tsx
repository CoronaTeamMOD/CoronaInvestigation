import React from 'react';
import { Typography } from '@material-ui/core';
import useStyles from './TransferDialogsStyles';

const TransferInvestigationDialogNote = (props: Props) => {
    const { isGroupedContact } = props;
    const classes = useStyles();
    return (
        <div>
            <Typography variant='body2'> שים לב, הפעולה תתבצע רק על חקירות השייכות לנפתך </Typography>
            {isGroupedContact && <Typography variant='body2' className={classes.bold}>חקירה זו הינה מקושרת, העברתה תעביר גם את החקירות המקושרות אליה</Typography>}
        </div>
    )
};

interface Props {
    isGroupedContact?: boolean;
}

export default TransferInvestigationDialogNote;