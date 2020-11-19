import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import logger from 'logger/logger';
import { timeout } from 'Utils/Timeout/Timeout';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationInfo from 'models/InvestigationInfo';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { setGender } from 'redux/Gender/GenderActionCreators';
import { setEpidemiologyNum, setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
import { setInvestigatedPatientId, setValidationDate , setIsCurrentlyHospitialized, setIsDeceased, setEndTime } from 'redux/Investigation/investigationActionCreators';

import useStyles from './InvestigationInfoBarStyles';
import {CommentContextProvider} from './Context/CommentContext';
import InvestigationMetadata from './InvestigationMetadata/InvestigationMetadata';
import InvestigatedPersonInfo from './InvestigatedPersonInfo/InvestigatedPersonInfo';

export const defaultUser = {
    id: '',
    userName: '',
    phoneNumber: '',
    serialNumber: '',
    investigationGroup: -1
}

const defaultInvestigationStaticInfo = {
    comment: '',
    startTime: new Date(),
    lastUpdateTime: new Date(),
    investigatingUnit: '',
    endTime: null,
    investigatedPatient: {
        isDeceased: false,
        additionalPhoneNumber: '',
        gender: '',
        identityType: '',
        isCurrentlyHospitalized: false,
        isInClosedInstitution: false,
        patientInfo: {
            fullName: '',
            primaryPhone: '',
            identityNumber: '',
            age: '',
            birthDate: null
        },
    },
    coronaTestDate: new Date(),
    investigatedPatientId: 0,
    userByCreator: defaultUser,
    userByLastUpdator: defaultUser
}

export const LandingPageTimer = 1900;

const InvestigationInfoBar: React.FC<Props> = ({ currentTab }: Props) => {

    let history = useHistory();
    const classes = useStyles();

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const lastOpenedEpidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.lastOpenedEpidemiologyNumber);
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    React.useEffect(() => {
        if (lastOpenedEpidemiologyNumber !== defaultEpidemiologyNumber) {
            setEpidemiologyNum(lastOpenedEpidemiologyNumber);
            setLastOpenedEpidemiologyNum(defaultEpidemiologyNumber);
        } else {
            handleInvalidEntrance();
        }
    }, []);

    React.useEffect(() => {
        const investigationInfoLogger = logger.setup({
            workflow: 'Fetching investigation Info',
            service: Service.CLIENT,
            user: userId,
            investigation: epidemiologyNumber
        });
        investigationInfoLogger.info('launching investigation info request',Severity.LOW)
        epidemiologyNumber !== defaultEpidemiologyNumber &&
            axios.get(`/investigationInfo/staticInfo?investigationId=${epidemiologyNumber}`
            ).then((result: any) => {
                if (result && result.data) {
                    investigationInfoLogger.info('investigation info request was successful',Severity.LOW)
                    const investigationInfo : InvestigationInfo = result.data;
                    setInvestigatedPatientId(investigationInfo.investigatedPatientId);
                    setIsDeceased(investigationInfo.investigatedPatient.isDeceased);
                    setIsCurrentlyHospitialized(investigationInfo.investigatedPatient.isCurrentlyHospitalized);
                    const gender = investigationInfo.investigatedPatient.gender;
                    setGender(gender ? gender : '');
                    setValidationDate(investigationInfo.coronaTestDate);
                    setEndTime(investigationInfo.endTime);
                    setInvestigationStaticInfo(investigationInfo);
                }
                else {
                    investigationInfoLogger.warn('got status 200 but wrong data',Severity.HIGH)
                    handleInvalidEntrance();
                }
            }).catch((error) => {
                investigationInfoLogger.error(`got errors in server result: ${error}`,Severity.HIGH)
                handleInvalidEntrance()
            });
    }, [epidemiologyNumber]);

    const handleInvalidEntrance = () => {
        Swal.fire({
            icon: 'warning',
            title: 'נכנסת לעמוד חקירה מבלי לעבור בדף הנחיתה! הנך מועבר לשם',
            customClass: {
                title: classes.swalTitle
            },
            timer: 1750,
            showConfirmButton: false
        });

        timeout(LandingPageTimer).then(() => history.push(landingPageRoute));
    };

    const updateComment = (comment: string | null) => {
        setInvestigationStaticInfo(prevData => ({...prevData, comment}));
    }

    return (
        <CommentContextProvider value={{comment:investigationStaticInfo.comment, setComment:updateComment}}>
            <InvestigatedPersonInfo
                investigatedPatientStaticInfo={investigationStaticInfo.investigatedPatient}
                currentTab={currentTab}
                epedemioligyNumber={epidemiologyNumber}
                coronaTestDate={investigationStaticInfo.coronaTestDate}
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
