import React from 'react';

import axios from 'Utils/axios';
import { InvestigationInfo } from 'models/InvestigationInfo';

import InvestigatedPersonInfo from './InvestigatedPersonInfo/InvestigatedPersonInfo';
import InvestigationMetadata from './InvestigationMetadata/InvestigationMetadata';

const defaultInvestigationStaticInfo = {
    startTime: new Date(),
    lastUpdateTime: new Date(),
    investigatingUnit: '',
    userByCreator: {
        personByPersonId: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            identificationType: '',
            identificationNumber: '',
            additionalPhoneNumber: '',
            gender: '',
            birthDate: new Date(),
        }
    },
    userByLastUpdator: {
        personByPersonId: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            identificationType: '',
            identificationNumber: '',
            additionalPhoneNumber: '',
            gender: '',
            birthDate: new Date(),
        }
    },
    investigatedPatientByInvestigatedPatientId: {
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
        isDeceased: false
    },
    coronaTestDate: new Date()
}

const InvestigationInfoBar = (props: Props) => {

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    const { epedemioligyNumber } = props;

    React.useEffect(() => {
        axios.post('/investigationInfo/staticInfo', {
            investigationId: epedemioligyNumber
        }).then((result: any) => {
            if (result && result.data && result.data.data)
                setInvestigationStaticInfo(result.data.data.investigationByEpidemioligyNumber);
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
