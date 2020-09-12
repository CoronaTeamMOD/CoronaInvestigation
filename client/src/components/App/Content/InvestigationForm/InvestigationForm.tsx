import React from 'react';
import { useSelector } from 'react-redux';

import StoreStateType from 'redux/storeStateType';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import ClinicalDetailsData from 'models/Contexts/ClinicalDetailsContextData';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import StartInvestigationDateVariables from 'models/StartInvestigationDateVariables';
import {
    initialPersonalInfo,
    PersonalInfoContextProvider,
    PersonalInfoDataAndSet
} from 'commons/Contexts/PersonalInfoStateContext';
import { ClinicalDetailsDataContextProvider, ClinicalDetailsDataAndSet, initialClinicalDetails } from 'commons/Contexts/ClinicalDetailsContext';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import TabManagement from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';

export const LAST_TAB_ID = 3;
const END_INVESTIGATION = 'סיים חקירה';
const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    const [personalInfoData, setPersonalInfoData] = React.useState<personalInfoContextData>(initialPersonalInfo);

    const personalInfoValue: PersonalInfoDataAndSet = React.useMemo(
        () => ({
            personalInfoData,
            setPersonalInfoData
        }),
        [personalInfoData, setPersonalInfoData]
    );

    const [exposureDate, setExposureDate] = React.useState<Date>();
    const [symptomsStartDate, setSymptomsStartDate] = React.useState<Date>();
    const [hasSymptoms, setHasSymptoms] = React.useState<boolean>(false);
    const [endInvestigationDate, setEndInvestigationDate] = React.useState<Date>(new Date());
    const [clinicalDetailsData, setClinicalDetailsData] = React.useState<ClinicalDetailsData>(initialClinicalDetails);

    const clinicalDetailsVariables: ClinicalDetailsDataAndSet = React.useMemo(() => ({
        clinicalDetailsData,
        setClinicalDetailsData
    }),
        [clinicalDetailsData, setClinicalDetailsData]
    );

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

    const { currentTab, setCurrentTab, confirmFinishInvestigation, handleSwitchTab } = useInvestigationForm({ clinicalDetailsVariables, personalInfoData, setPersonalInfoData });
        
    return (
        <div className={classes.content}>
            <PersonalInfoContextProvider value={personalInfoValue}>
                <ClinicalDetailsDataContextProvider value={clinicalDetailsVariables}>
                    <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                        <InvestigationInfoBar />
                        <div className={classes.interactiveForm}>
                            <TabManagement
                                currentTab={currentTab}
                                setCurrentTab={setCurrentTab}
                            />
                            <div className={classes.buttonSection}>
                                <PrimaryButton test-id={currentTab.id === LAST_TAB_ID ? 'endInvestigation' : 'continueToNextStage'}
                                    onClick={() => {
                                        currentTab.id === LAST_TAB_ID ? confirmFinishInvestigation(epidemiologyNumber) : handleSwitchTab();
                                    }}>
                                    {currentTab.id === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                                </PrimaryButton>
                            </div>
                        </div>
                    </StartInvestigationDateVariablesProvider>
                </ClinicalDetailsDataContextProvider>
            </PersonalInfoContextProvider>
        </div>
    )
}

export default InvestigationForm;
