import React from 'react';
import { Button } from '@material-ui/core';

import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import { ClinicalDetailsDataContextProvider, ClinicalDetailsDataAndSet, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';

import useContent from './useInvestigationForm';
import useStyles from './InvestigationFormStyles';
import TabManagement, {tabs} from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';

export const LAST_TAB_ID = 3;
export const END_INVESTIGATION = 'סיים חקירה';
export const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [symptomsStartDate, setSymptomsStartDate] = React.useState<Date>();
    const [clinicalDetailsData, setClinicalDetailsData] = React.useState<ClinicalDetailsData>(initialClinicalDetails);

    const {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation
    } = useContent();

    const startInvestigationDateVariables: StartInvestigationDateVariables = React.useMemo(() => ({
            exposureDate, 
            symptomsStartDate, 
            setExposureDate,
            setSymptomsStartDate
        }),
        [exposureDate, symptomsStartDate, setSymptomsStartDate, setExposureDate]
    );

    const clinicalDetailsVariables: ClinicalDetailsDataAndSet = React.useMemo(() => ({
        clinicalDetailsData,
        setClinicalDetailsData
    }),
    [clinicalDetailsData, setClinicalDetailsData]
);

    return (
        <div className={classes.content}>
            <ClinicalDetailsDataContextProvider value={clinicalDetailsVariables}>
                <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                    <InvestigationInfoBar />
                    <div className={classes.interactiveForm}>
                        <TabManagement
                            currentTab={currentTab}
                            setCurrentTab={setCurrentTab}
                        />
                        <div className={classes.buttonSection}>
                            <Button variant='contained' className={classes.finishInvestigationButton} onClick={() => {
                                currentTab.id === LAST_TAB_ID ? confirmFinishInvestigation() :
                                    setCurrentTab(tabs[currentTab.id + 1])
                                    //console.log(clinicalDetailsVariables.clinicalDetailsData)
                            }}>
                                {currentTab.id === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                            </Button>
                        </div>
                    </div>
                </StartInvestigationDateVariablesProvider>
            </ClinicalDetailsDataContextProvider>
        </div>
    )
}

export default InvestigationForm;
