import React from 'react';
import { Button } from '@material-ui/core';

import useContent from './useInvestigationForm';
import useStyles from './InvestigationFormStyles';
import TabManagement, {tabs} from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';

export const LAST_TAB_ID = 3;
export const END_INVESTIGATION = 'סיים חקירה';
export const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation
    } = useContent();

    return (
        <div className={classes.content}>
            <InvestigationInfoBar/>
            <div className={classes.interactiveForm}>
                <TabManagement
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                />
                <div className={classes.buttonSection}>
                    <Button className={classes.finishInvestigationButton} onClick={() => {
                        currentTab.id === LAST_TAB_ID ? confirmFinishInvestigation() :
                            setCurrentTab(tabs[currentTab.id + 1])
                    }}>
                        {currentTab.id === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InvestigationForm;
