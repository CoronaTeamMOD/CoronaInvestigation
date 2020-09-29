import React from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import axios from 'Utils/axios';
import { timeout } from 'Utils/Timeout/Timeout';
import StoreStateType from 'redux/storeStateType';
import { landingPageRoute } from 'Utils/Routes/Routes';
import { InvestigationInfo } from 'models/InvestigationInfo';
import { setGender } from 'redux/Gender/GenderActionCreators';
import { setEpidemiologyNum } from 'redux/Investigation/investigationActionCreators';
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

const InvestigationInfoBar: React.FC<Props> = ({ onExitInvestigation }: Props) => {

    let history = useHistory();
    const classes = useStyles();

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

    let { selectedEpidemiologyNumber } = useParams();

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
        selectedEpidemiologyNumber ?
            setEpidemiologyNum(parseInt(selectedEpidemiologyNumber)) :
            noInvestigationError();
    }, []);

    React.useEffect(() => {
        epidemiologyNumber !== -1 &&
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
                onExitInvestigation={onExitInvestigation}
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
    onExitInvestigation: () => Promise<void>;
}

export default InvestigationInfoBar;
