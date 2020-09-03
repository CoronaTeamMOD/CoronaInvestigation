import React from 'react';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import { ClinicalDetailsDataContextProvider, ClinicalDetailsDataAndSet, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
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
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [endInvestigationDate, setEndInvestigationDate] = React.useState<Date>(new Date());
    const [clinicalDetailsData, setClinicalDetailsData] = React.useState<ClinicalDetailsData>(initialClinicalDetails);
    const {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation
    } = useInvestigationForm();

    const startInvestigationDateVariables: StartInvestigationDateVariables = React.useMemo(() => ({ 
            exposureDate, 
            symptomsStartDate, 
            hasSymptoms,
            endInvestigationDate,
            setExposureDate,
            setSymptomsStartDate,
            setHasSymptoms,
            setEndInvestigationDate,
        }),
        [exposureDate, symptomsStartDate, hasSymptoms, endInvestigationDate,
        setSymptomsStartDate, setExposureDate, setHasSymptoms, setEndInvestigationDate]
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
                            <PrimaryButton
                                onClick={() => {
                                    currentTab.id === LAST_TAB_ID ? confirmFinishInvestigation() :
                                        setCurrentTab(tabs[currentTab.id + 1])
                                }}>
                                {currentTab.id === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                            </PrimaryButton>
                        </div>
                    </div>
                </StartInvestigationDateVariablesProvider>
            </ClinicalDetailsDataContextProvider>
        </div>
    )
}

export default InvestigationForm;
