import React from 'react';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router-dom';

import axios from 'Utils/axios';
import { timeout } from 'Utils/Timeout/Timeout';
import { landingPageRoute } from 'Utils/Routes/Routes';
import { InvestigationInfo } from 'models/InvestigationInfo';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

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

const InvestigationInfoBar = (props: Props) => {

    let history = useHistory();
    const { epidemiologyNumber } = props;

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    React.useEffect(() => {
        axios.post('/investigationInfo/staticInfo', {
            investigationId: epidemiologyNumber
        }).then((result: any) => {
            if (result && result.data && result.data.data && result.data.data.investigationByEpidemiologyNumber) {
                setInvestigationStaticInfo(result.data.data.investigationByEpidemiologyNumber);
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
                Swal.fire({
                    icon: 'warning',
                    title: 'נכנסת לעמוד חקירה מבלי לעבור בדף הנחיתה! הנך מועבר לשם',
                    timer: 1750,
                    showConfirmButton: false
                });

                timeout(1900).then(() => history.push(landingPageRoute));
            }
        })
    }, []);

    return (
        <>
            <InvestigatedPersonInfo
                investigatedPatientByInvestigatedPatientId={
                    investigationStaticInfo.investigatedPatientByInvestigatedPatientId
                }
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
    epidemiologyNumber: number;
}

export default InvestigationInfoBar;
