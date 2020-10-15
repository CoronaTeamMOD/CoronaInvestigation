import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { store } from 'redux/store';
import { timeout } from 'Utils/Timeout/Timeout';
import { Service, Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationInfo from 'models/InvestigationInfo';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { setGender } from 'redux/Gender/GenderActionCreators';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';
import { setEpidemiologyNum, setLastOpenedEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';

import useStyles from './InvestigationInfoBarStyles';
import InvestigationMetadata from './InvestigationMetadata/InvestigationMetadata';
import InvestigatedPersonInfo from './InvestigatedPersonInfo/InvestigatedPersonInfo';

const defaultUser = {
    id: '',
    userName: '',
    phoneNumber: '',
    serialNumber: '',
    investigationGroup: -1
}

const defaultInvestigationStaticInfo = {
    startTime: new Date(),
    lastUpdateTime: new Date(),
    investigatingUnit: '',
    investigatedPatient: {
        isDeceased: false,
        additionalPhoneNumber: '',
        gender: '',
        identityType: '',
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
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const noInvestigationError = () => {
        Swal.fire({
            icon: 'warning',
            title: 'נכנסת לעמוד חקירה מבלי לעבור בדף הנחיתה! הנך מועבר לשם',
            customClass: {
                title: classes.swalTitle
            },
            timer: 1750,
            showConfirmButton: false
        });

        timeout(1900).then(() => history.push(landingPageRoute));
    }

    React.useEffect(() => {
        timeout(2000).then(() => {
            let openedEpidemiologyNumber = store.getState().investigation.lastOpenedEpidemiologyNumber;
            if (openedEpidemiologyNumber !== defaultEpidemiologyNumber) {
                setEpidemiologyNum(openedEpidemiologyNumber);
                setLastOpenedEpidemiologyNum(defaultEpidemiologyNumber);
            } else {
                noInvestigationError();
            }
        });
    }, []);

    React.useEffect(() => {
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching investigation Info',
            step: 'launching investigation info request',
            user: userId,
            investigation: epidemiologyNumber
        });
        epidemiologyNumber !== defaultEpidemiologyNumber &&
        axios.get(`/investigationInfo/staticInfo?investigationId=${epidemiologyNumber}`
        ).then((result: any) => {
            if (result && result.data) {
                logger.info({
                    service: Service.CLIENT,
                    severity: Severity.LOW,
                    workflow: 'Fetching investigation Info',
                    step: 'investigation info request was successful',
                    user: userId,
                    investigation: epidemiologyNumber
                });
                const investigationInfo = result.data;
                setInvestigatedPatientId(investigationInfo.investigatedPatientId);
                const gender = investigationInfo.investigatedPatient.gender;
                setGender(gender ? gender : '');
                setInvestigationStaticInfo(investigationInfo);
            }
            else {
                logger.warn({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Fetching investigation Info',
                    step: 'got status 200 but wrong data'
                });
                handleInvalidEntrance();
            }
        })
        .catch((error) => { 
            logger.error({
                service: Service.CLIENT,
                severity: Severity.HIGH,
                workflow: 'Fetching investigation Info',
                step: `got errors in server result: ${error}`,
                user: userId,
                investigation: epidemiologyNumber
            });
            handleInvalidEntrance()
        })
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
    }

    return (
        <>
            <InvestigatedPersonInfo
                investigatedPatientStaticInfo={
                    investigationStaticInfo.investigatedPatient
                }
                currentTab={currentTab}
                epedemioligyNumber={epidemiologyNumber}
                coronaTestDate={investigationStaticInfo.coronaTestDate}
            />
            <InvestigationMetadata
                investigationMetaData={
                    investigationStaticInfo
                }
            />
        </>
    );
};

interface Props {
    currentTab: number;
}

export default InvestigationInfoBar;
