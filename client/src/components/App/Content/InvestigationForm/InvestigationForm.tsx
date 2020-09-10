import React from 'react';
import { useSelector, connect } from 'react-redux';


import Gender from 'models/enums/Gender';
import StoreStateType from 'redux/storeStateType';
import IdentificationType from 'models/enums/IdentificationTypes';
import relevantOccupations from 'models/enums/relevantOccupations';
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
import TabManagement, {tabs} from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider } from './StartInvestiationDateVariables/StartInvestigationDateVariables';

const LAST_TAB_ID = 3;
const END_INVESTIGATION = 'סיים חקירה';
const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

// TODO: remove after redux is connected
//const epedemioligyNumber = 111;


const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    const creator = useSelector<StoreStateType, string>(state => state.investigation.creator);
    const lastUpdator = useSelector<StoreStateType, string>(state => state.investigation.lastUpdator);

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

    const { currentTab, setCurrentTab, confirmFinishInvestigation, handleSwitchTab } = useInvestigationForm({ clinicalDetailsVariables });
        
    return (
        <div className={classes.content}>
            <PersonalInfoContextProvider value={personalInfoValue}>
                <ClinicalDetailsDataContextProvider value={clinicalDetailsVariables}>
                    <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                        <InvestigationInfoBar
                            // TODO: connect to redux epedemioligyNumber
                            epedemioligyNumber={epidemiologyNumber}
                        />
                        <div className={classes.interactiveForm}>
                            <TabManagement
                                currentTab={currentTab}
                                setCurrentTab={setCurrentTab}
                            />
                            <div className={classes.buttonSection}>
                                <PrimaryButton
                                    onClick={() => {
                                        currentTab.id === LAST_TAB_ID ? confirmFinishInvestigation(epidemiologyNumber) : handleSwitchTab(investigatedPatientId, epidemiologyNumber, creator, lastUpdator);
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

interface Props {
    epedemioligyNumber: number
}

const mapStateToProps = (store: StoreStateType) => {
    return {
        epedemioligyNumber: store.investigation.epidemiologyNumber
    }
}

export default connect(
    mapStateToProps
 )(InvestigationForm);
