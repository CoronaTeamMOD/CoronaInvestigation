import React from 'react';
import { Typography, Checkbox } from '@material-ui/core';
import useStyles from './TransferDialogsStyles';

const TransferInvestigationDialogNote = (props: Props) => {
    const { isGroupedContact, allowGroupedContactAlert, setAllowGroupedContactAlert } = props;
    const classes = useStyles();
    return (
        <div>
            <Typography variant='body2'> שים לב, הפעולה תתבצע רק על חקירות השייכות לנפתך </Typography>
            {isGroupedContact && <div className={classes.alertCheckboxMsg}>
                <Checkbox
                    onClick={() => setAllowGroupedContactAlert(!allowGroupedContactAlert)}
                    color='primary'
                    checked={allowGroupedContactAlert}
                />
                <Typography variant='body2' className={classes.alertMsg}>חקירה זו הינה מקושרת, העברתה תעביר גם את החקירות המקושרות אליה</Typography>
            </div>
            }
        </div>
    )
};

interface Props {
    isGroupedContact?: boolean;
    allowGroupedContactAlert?: boolean;
    setAllowGroupedContactAlert?: any;
}

export default TransferInvestigationDialogNote;