import React from 'react';
import { Button } from '@material-ui/core';

import Gender from 'models/enums/Gender';
import IdentificationType from 'models/enums/IdentificationTypes';
import RelevantOccupations from 'models/enums/RelevantOccupations';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';
import { PersonalInfoContextProvider, PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';

import useContent from './useInvestigationForm';
import useStyles from './InvestigationFormStyles';
import TabManagement, {tabs} from './TabManagement/TabManagement';
import InvestigationInfoBar from './InvestigationInfo/InvestigationInfoBar';

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
            neighbourhood: '',
            street: '',
            houseNumber: -1,
            entrance: '',
            floor: -1,
            apartment: -1
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

    const {
        currentTab,
        setCurrentTab,
        confirmFinishInvestigation
    } = useContent();

    return (
        <div className={classes.content}>
            <InvestigationInfoBar/>
            <PersonalInfoContextProvider value={personalInfoValue}>
                <div className={classes.interactiveForm}>
                        <TabManagement
                            currentTab={currentTab}
                            setCurrentTab={setCurrentTab}
                        />
                    <div className={classes.buttonSection}>
                        <Button className={classes.finishInvestigationButton} onClick={() => {
                            currentTab.id === LAST_TAB_ID ? confirmFinishInvestigation() :
                                setCurrentTab(tabs[currentTab.id + 1])
                            
                            console.log(personalInfoData);
                        }}>
                            {currentTab.id === LAST_TAB_ID ? END_INVESTIGATION : CONTINUE_TO_NEXT_TAB}
                        </Button>
                    </div>
                </div>
            </PersonalInfoContextProvider>
        </div>
    )
}

export default InvestigationForm;
