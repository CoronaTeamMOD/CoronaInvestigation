import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import { store } from 'redux/store';
import { timeout } from 'Utils/Timeout/Timeout';
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
    investigatedPatientByInvestigatedPatientId: {
        isDeceased: false,
        personByPersonId: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            identificationType: '',
            identificationNumber: '',
            additionalPhoneNumber: '',
            gender: '',
            birthDate: new Date(),
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
        epidemiologyNumber !== defaultEpidemiologyNumber &&
        axios.get(`/investigationInfo/staticInfo?investigationId=${epidemiologyNumber}`
        ).then((result: any) => {
            if (result && result.data && result.data.data && result.data.data.investigationByEpidemiologyNumber) {
                setInvestigatedPatientId(result.data.data.investigationByEpidemiologyNumber.investigatedPatientId);
                setGender(result.data.data.investigationByEpidemiologyNumber.investigatedPatientByInvestigatedPatientId.personByPersonId.gender);
                setInvestigationStaticInfo(result.data.data.investigationByEpidemiologyNumber);
            }
            else {
                noInvestigationError();
            }
        }) 
    }, [epidemiologyNumber]);

    return (
        <>
            <InvestigatedPersonInfo
                investigatedPatientByInvestigatedPatientId={
                    investigationStaticInfo.investigatedPatientByInvestigatedPatientId
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
