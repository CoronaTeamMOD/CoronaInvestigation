import React from 'react';
import { Button } from '@material-ui/core';

import useStyles from './ContentStyles';
import TabManagement from './TabManagement/TabManagement';

const Content: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <div className={classes.content}>
            <TabManagement/>
            <div className={classes.buttonSection}>
                <Button variant='contained' className={classes.finishInvestigationButton}>סיים חקירה</Button>
            </div>
        </div>
    )
}

export default Content;
