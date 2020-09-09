import React from 'react';

import axios from 'Utils/axios';
import { InvestigationInfo } from 'models/InvestigationInfo';

import InvestigatedPersonInfo from './InvestigatedPersonInfo/InvestigatedPersonInfo';
import InvestigationMetadata from './InvestigationMetadata/InvestigationMetadata';

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
    userByCreator: {
        id: '',
        userName: '',
        phoneNumber: '',
        serialNumber: '',
        investigationGroup: -1
    },
    userByLastUpdator: {
        id: '',
        userName: '',
        phoneNumber: '',
        serialNumber: '',
        investigationGroup: -1
    },
}

const InvestigationInfoBar = (props: Props) => {

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    const { epedemioligyNumber } = props;

    React.useEffect(() => {
        axios.post('/investigationInfo/staticInfo', {
            investigationId: 111
        }).then((result: any) => {
            if(result && result.data && result.data.data)
            setInvestigationStaticInfo(result.data.data.investigationByEpidemiologyNumber);
            console.log(result)
        })
    }, []);

    return (
        <>
            <InvestigatedPersonInfo
                investigatedPatientByInvestigatedPatientId={
                    investigationStaticInfo.investigatedPatientByInvestigatedPatientId
                }
                epedemioligyNumber={epedemioligyNumber}
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
    epedemioligyNumber: number;
}

export default InvestigationInfoBar;
