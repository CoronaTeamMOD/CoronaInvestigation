import React from 'react';
import { Button } from '@material-ui/core';

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
            phoneNumber: ''
        }
    },
    userByLastUpdator: {
        personByPersonId: {
            firstName: '',
            lastName: '',
        }
    },
    investigatedPatientByInvestigatedPatientId: {
        personByPersonId: {
            identificationType: '',
            identificationNumber: '',
            gender: '',
            firstName: '',
            lastName: '',
            birthDate: new Date(),
        },
        isDeceased: false
    }
}

const InvestigationInfoBar = (props: Props) => {

    const [investigationStaticInfo, setInvestigationStaticInfo] = React.useState<InvestigationInfo>(defaultInvestigationStaticInfo);

    const { epedemioligyNumber } = props;

    React.useEffect(() => {
        axios.post('/investigationInfo/staticInfo', {
            investigationId: 111
        }).then((result: any) => {
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
    epedemioligyNumber: number
}

export default InvestigationInfoBar;