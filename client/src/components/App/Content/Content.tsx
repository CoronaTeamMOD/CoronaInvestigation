import React from 'react';
import { Button } from '@material-ui/core';

import TabObj from 'models/TabObj';
import useContent from './useContent';
import useStyles from './ContentStyles';
import TabManagement from './TabManagement/TabManagement';

export const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים'
};

const Content: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [currentTab, setCurrentTab] = React.useState<TabObj>(defaultTab);
    const { confirmFinishInvestigation } = useContent();
  
    return (
        <div className={classes.content}>
            <TabManagement
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
            />
            {
                currentTab.name === 'מקומות ומגעים' ?
                    <div className={classes.buttonSection}>
                        <Button className={classes.finishInvestigationButton} onClick={() => confirmFinishInvestigation()}>סיים חקירה</Button>
                    </div> : ''
            }
        </div>
    )
}

export default Content;
