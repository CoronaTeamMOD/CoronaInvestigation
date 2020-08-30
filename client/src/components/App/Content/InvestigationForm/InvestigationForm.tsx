import React from 'react';
import { Button } from '@material-ui/core';

import TabObj from 'models/TabObj';
import TabManagement from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import useContent from './useInvestigationForm';
import useStyles from './InvestigationFormStyles';

export const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים'
};

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [currentTab, setCurrentTab] = React.useState<TabObj>(defaultTab);
    const { confirmFinishInvestigation } = useContent();

    return (
        <div className={classes.content}>
            <InvestigationInfoBar/>

            <div className={classes.interactiveForm}>
                <TabManagement
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                />
                {
                    currentTab.name === 'מקומות ומגעים' &&
                    <div className={classes.buttonSection}>
                        <Button className={classes.finishInvestigationButton}
                            onClick={confirmFinishInvestigation}>
                                סיים חקירה
                        </Button>
                    </div> 
                }
            </div>
        </div>
    )
}

export default InvestigationForm;
