import React from 'react';

import Gender from 'models/enums/Gender';
import IdentificationType from 'models/enums/IdentificationTypes';
import RelevantOccupations from 'models/enums/RelevantOccupations';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import { PersonalInfoContextProvider, PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';

import useStyles from './InvestigationFormStyles';
import useInvestigationForm from './useInvestigationForm';
import TabManagement, {tabs} from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';
import { StartInvestigationDateVariablesProvider, StartInvestigationDateVariables } from './StartInvestigationDateVariables/StartInvestigationDateVariables';

export const LAST_TAB_ID = 3;
export const END_INVESTIGATION = 'סיים חקירה';
export const CONTINUE_TO_NEXT_TAB = 'המשך לשלב הבא';

const InvestigationForm: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [personalInfoData, setPersonalInfoData] = React.useState<personalInfoContextData>({
        phoneNumber: '',
        isInvestigatedPersonsNumber: true,
        selectReasonNumberIsNotRelated: '',
        writeReasonNumberIsNotRelated: '',
        additionalPhoneNumber: '',
        gender: Gender.MALE,
        identificationType: IdentificationType.ID,
        identificationNumber: '',
        age: '',
        motherName: '',
        fatherName: '',
        insuranceCompany: '',
        HMO: '',
        address: {
            city: '',
            neighborhood: '',
            street: '',
            houseNumber: '',
            entrance: '',
            floor: '',
            apartment: ''
        },
        relevantOccupation: RelevantOccupations.MOH_Worker,
        institutionName: ''
    });

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
    )
    
    return (
        <div className={classes.content}>
            <PersonalInfoContextProvider value={personalInfoValue}>
                <StartInvestigationDateVariablesProvider value={startInvestigationDateVariables}>
                    <InvestigationInfoBar/>
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
            </PersonalInfoContextProvider>
        </div>
    )
}

export default InvestigationForm;
