import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { defaultUser } from 'Utils/UsersUtils/userUtils';
import { truncateDate } from 'Utils/DateUtils/formatDate';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setGender } from 'redux/Gender/GenderActionCreators';
import { CommentContextProvider } from './Context/CommentContext';
import { landingPageRoute, adminLandingPageRoute } from 'Utils/Routes/Routes';
import InvestigationInfo , { InvestigationInfoData } from 'models/InvestigationInfo';
import { setEpidemiologyNum, setLastOpenedEpidemiologyNum, setDatesToInvestigateParams } from 'redux/Investigation/investigationActionCreators';
import { setInvestigatedPatientId , setIsCurrentlyHospitialized, setIsDeceased, setEndTime } from 'redux/Investigation/investigationActionCreators';

import InvestigationMetadata from './InvestigationMetadata/InvestigationMetadata';
import InvestigatedPersonInfo from './InvestigatedPersonInfo/InvestigatedPersonInfo';

const defaultInvestigationStaticInfo : InvestigationInfo = {
    comment: '',
    startTime: new Date(),
    lastUpdateTime: new Date(),
    investigatingUnit: '',
    endTime: null,
    symptomsStartDate: null,
    doesHaveSymptoms: false,
    isDeceased: false,
    additionalPhoneNumber: '',
    gender: '',
    identityType: '',
    isCurrentlyHospitalized: false,
    isInClosedInstitution: false,
    fullName: '',
    primaryPhone: '',
    identityNumber: '',
    age: '',
    birthDate: null,
    validationDate: new Date(),
    investigatedPatientId: 0,
    userByCreator: defaultUser,
    userByLastUpdator: defaultUser,
    isReturnSick: false,
    previousDiseaseStartDate: null,
    isVaccinated: false,
    vaccinationEffectiveFrom: null,
    isSuspicionOfMutation: false,
    mutationName: null
};

export const LandingPageTimer = 1900;

const InvestigationInfoBar: React.FC<Props> = ({ currentTab }: Props) => {

    let history = useHistory();
    const { alertWarning } = useCustomSwal();

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const lastOpenedEpidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.lastOpenedEpidemiologyNumber);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    React.useEffect(() => {
        if (lastOpenedEpidemiologyNumber !== defaultEpidemiologyNumber) {
            setEpidemiologyNum(lastOpenedEpidemiologyNumber);
            setLastOpenedEpidemiologyNum(defaultEpidemiologyNumber);
        } else {
            //handleInvalidEntrance();
        }
    }, []);

    React.useEffect(() => {
        const investigationInfoLogger = logger.setup('Fetching investigation Info');
        investigationInfoLogger.info('launching investigation info request', Severity.LOW);
        epidemiologyNumber !== defaultEpidemiologyNumber &&
            axios.get('/investigationInfo/staticInfo')
            .then((result: any) => {
                if (result && result.data) {
                    investigationInfoLogger.info('investigation info request was successful', Severity.LOW);
                    const investigationInfo : InvestigationInfoData = result.data;
                    setInvestigatedPatientId(investigationInfo.investigatedPatientId);
                    setIsDeceased(investigationInfo.isDeceased);
                    setIsCurrentlyHospitialized(investigationInfo.isCurrentlyHospitalized);
                    const gender = investigationInfo.gender;
                    setGender(gender ? gender : '');
                    const formattedValidationDate  = truncateDate(investigationInfo.validationDate);
                    const formattedSymptomsDate = truncateDate(investigationInfo.symptomsStartDate);
                    const formattedInvestigationInfo = {
                        ...investigationInfo,
                        symptomsStartDate : formattedSymptomsDate,
                        validationDate : formattedValidationDate
                    }
                    setDatesToInvestigateParams({
                        symptomsStartDate: truncateDate(investigationInfo.symptomsStartDate), 
                        doesHaveSymptoms: investigationInfo.doesHaveSymptoms,
                        }, 
                        formattedValidationDate
                    );
                    setEndTime(investigationInfo.endTime);
                    setInvestigationStaticInfo(formattedInvestigationInfo);
                }
                else {
                    investigationInfoLogger.warn('got status 200 but wrong data', Severity.HIGH);
                    handleInvalidEntrance();
                }
            }).catch((error) => {
                investigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                handleInvalidEntrance()
            });
    }, [epidemiologyNumber]);

    const handleInvalidEntrance = () => {
        alertWarning('נכנסת לעמוד חקירה מבלי לעבור בדף הנחיתה! הנך מועבר לשם', {
            timer: 1750,
            showConfirmButton: false
        });
        timeout(LandingPageTimer).then(() =>
            (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) ? history.push(adminLandingPageRoute) : history.push(landingPageRoute));
    };

    const updateComment = (comment: string | null) => {
        setInvestigationStaticInfo(prevData => ({...prevData, comment}));
    }

    return (
        <CommentContextProvider value={{comment:investigationStaticInfo.comment, setComment:updateComment}}>
            <InvestigatedPersonInfo
                investigationStaticInfo={investigationStaticInfo}
                currentTab={currentTab}
                epedemioligyNumber={epidemiologyNumber}
            />
            <InvestigationMetadata
                investigationMetaData={investigationStaticInfo}
            />
        </CommentContextProvider>
    );
};

interface Props {
    currentTab: number;
};

export default InvestigationInfoBar;