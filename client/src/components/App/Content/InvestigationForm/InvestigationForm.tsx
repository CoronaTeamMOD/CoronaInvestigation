import React from 'react';
import { Button } from '@material-ui/core';

import TabObj from 'models/TabObj';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';

import useContent from './useInvestigationForm';
import useStyles from './InvestigationFormStyles';
import TabManagement from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';

export const defaultTab: TabObj = {
    id: 0,
    name: 'פרטים אישיים',
    displayComponent: <></>
};

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [hasSymptoms, setHasSymptoms] = React.useState<Date>();
    const [currentTab, setCurrentTab] = React.useState<TabObj>(defaultTab);
    const { confirmFinishInvestigation } = useContent();

    const startInvestigationDateVariables: StartInvestigationDateVariables = React.useMemo(() => ({ 
            exposureDate, 
            hasSymptoms, 
            setExposureDate,
            setHasSymptoms
        }),
        [exposureDate, hasSymptoms, setHasSymptoms, setExposureDate]
    )

    return (
        <div className={classes.content}>
            <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
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
                                    onClick={confirmFinishInvestigation}>סיים חקירה</Button>
                        </div> 
                    }
                </div>
            </StartInvestigationDateVariablesProvider>
        </div>
    )
}

export default InvestigationForm;
