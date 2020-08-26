import React from 'react';

import useStyles from './ContentStyles';
import TabManagement from './TabManagement/TabManagement';
import { Button } from '@material-ui/core';

const Content: React.FC = (): JSX.Element => {
    const classes = useStyles({});
  
    return (
        <div className={classes.content}>
            <TabManagement></TabManagement>
            <Button variant='contained' className={classes.finishInvestigationButton}>סיים חקירה</Button>
        </div>
    )
}

export default Content;
