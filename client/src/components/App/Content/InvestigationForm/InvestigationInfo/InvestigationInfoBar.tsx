import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { defaultUser } from 'Utils/UsersUtils/userUtils';
import { truncateDate } from 'Utils/DateUtils/formatDate';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import { setGender } from 'redux/Gender/GenderActionCreators';
import { CommentContextProvider } from './Context/CommentContext';
import { landingPageRoute, adminLandingPageRoute } from 'Utils/Routes/Routes';
import InvestigationInfo , { InvestigationInfoData } from 'models/InvestigationInfo';
import { setEpidemiologyNum, setLastOpenedEpidemiologyNum, setDatesToInvestigateParams } from 'redux/Investigation/investigationActionCreators';
import { setInvestigatedPatientId , setIsCurrentlyHospitialized, setIsDeceased, setEndTime, setTrackingRecommendation, setBirthDate } from 'redux/Investigation/investigationActionCreators';

import useGroupedInvestigationContacts from '../useGroupedInvestigationContacts';
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

export const LandingPageTimer = 4000;

const unauthorizedErrorMessages: Record<number, string> = {
    [UserTypeCodes.INVESTIGATOR] : 'החקירה אינה מוקצית אליך',
    [UserTypeCodes.ADMIN] : 'החקירה אינה נמצאת בנפה שלך',
    [UserTypeCodes.SUPER_ADMIN] : 'החקירה אינה נמצאת במחוז שלך',
}

const UNAUTHORIZED_ERROR_TEXT = 'אין לך הרשאות לבצע פעולות על החקירה';

const InvestigationInfoBar: React.FC<Props> = ({ currentTab }: Props) => {

    let history = useHistory();
    const { alertWarning, alertError } = useCustomSwal();

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);
    const [authorized, setAuthorized] = React.useState<boolean>(true);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const lastOpenedEpidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.lastOpenedEpidemiologyNumber);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    const {setGroupedInvestigationsDetailsAsync} = useGroupedInvestigationContacts();

    const unauthorizedResponseInterceptor = axios.interceptors.response.use(response => {
        return response
    }, error => {
        if(error.response.status === 401) {
            setAuthorized(false);
        }
        return error
    })

    React.useEffect(() => {
        if (lastOpenedEpidemiologyNumber !== defaultEpidemiologyNumber) {
            setEpidemiologyNum(lastOpenedEpidemiologyNumber);
            setLastOpenedEpidemiologyNum(defaultEpidemiologyNumber);
        } else {
            handleInvalidEntrance();
        }
    }, []);

    React.useEffect(() => {
        if(!authorized) {
            axios.interceptors.response.eject(unauthorizedResponseInterceptor);
            handleUnauthorizedResponse();
        }
    }, [authorized]);

    React.useEffect(() => {
        const investigationInfoLogger = logger.setup('Fetching investigation Info');
        investigationInfoLogger.info('launching investigation info request', Severity.LOW);
        if(epidemiologyNumber !== defaultEpidemiologyNumber) { 
            axios.get('/investigationInfo/staticInfo')
            .then((result: any) => {
                if (result && result.data) {
                    investigationInfoLogger.info('investigation info request was successful', Severity.LOW);
                    const investigationInfo : InvestigationInfoData = result.data;
                    setInvestigatedPatientId(investigationInfo.investigatedPatientId);
                    setIsDeceased(investigationInfo.isDeceased);
                    setIsCurrentlyHospitialized(investigationInfo.isCurrentlyHospitalized);
                    setBirthDate(investigationInfo.birthDate ? new Date(investigationInfo.birthDate) : new Date('01.01.1970'));
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
                    setTrackingRecommendation({
                        reason: investigationInfo.trackingSubReasonByTrackingSubReason?.reasonId ?? 0,
                        subReason: investigationInfo.trackingSubReasonByTrackingSubReason?.subReasonId,
                        extraInfo: investigationInfo.trackingExtraInfo 
                    })
                }
                else {
                    investigationInfoLogger.warn('got status 200 but wrong data', Severity.HIGH);
                    handleInvalidEntrance();
                }
            }).catch((error) => {
                investigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                handleInvalidEntrance()
            });
            setGroupedInvestigationsDetailsAsync();
        }
    }, [epidemiologyNumber]);

    const handleInvalidEntrance = () => {
        alertWarning('נכנסת לעמוד חקירה מבלי לעבור בדף הנחיתה! הנך מועבר לשם', {
            timer: 1750,
            showConfirmButton: false
        });
        timeout(LandingPageTimer).then(() =>
            (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) ? history.push(adminLandingPageRoute) : history.push(landingPageRoute));
    };

    const handleUnauthorizedResponse = () => {
        const errorText = `${UNAUTHORIZED_ERROR_TEXT}: ${unauthorizedErrorMessages[userType]}. הינך מועבר/ת לעמוד הראשי`
    
        alertError(errorText, {
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