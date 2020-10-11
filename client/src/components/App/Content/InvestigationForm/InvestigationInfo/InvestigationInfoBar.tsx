import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { landingPageRoute } from 'Utils/Routes/Routes';
import InvestigationInfo from 'models/InvestigationInfo';
import { setGender } from 'redux/Gender/GenderActionCreators';
import { setInvestigatedPatientId } from 'redux/Investigation/investigationActionCreators';

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
            age: ''
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

    React.useEffect(() => { 
        axios.get(`/investigationInfo/staticInfo?investigationId=${epidemiologyNumber}`
        ).then((result: any) => {
            if (result && result.data) {
                const investigationInfo = result.data;
                setInvestigatedPatientId(investigationInfo.investigatedPatientId);
                const gender = investigationInfo.gender;
                setGender(gender ? gender : '');
                setInvestigationStaticInfo(investigationInfo);
            }
            else {
                handleInvalidEntrance();
            }
        })
        .catch(() => handleInvalidEntrance)
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
