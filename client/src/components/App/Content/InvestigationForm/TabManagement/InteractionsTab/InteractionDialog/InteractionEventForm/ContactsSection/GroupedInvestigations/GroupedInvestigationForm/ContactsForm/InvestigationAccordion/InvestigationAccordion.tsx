import React from 'react';
import { Accordion } from '@material-ui/core';

import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';


import AccordionContent from './AccordionContent/AccordionContent';
import AccordionHeadline from './AccordionHeadline/AccordionHeadline';

const InvestigationAccordion = (props: Props) => {
    const { selectedRows , contact , setSelectedRows} = props;
    const { epidemiologyNumber , contactEventsByInvestigationId , investigatedPatientByInvestigatedPatientId } = contact;
    const { fullName , identityNumber } = investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient;

    return (
        <Accordion>
            <AccordionHeadline
                epidemiologyNumber={epidemiologyNumber}
                fullName={fullName}
                identityNumber={identityNumber}
            />
            <AccordionContent 
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                events={contactEventsByInvestigationId.nodes}
            />
        </Accordion>
    )
}

interface Props {
    selectedRows: number[];
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
    contact: ConnectedInvestigation;
}

export default InvestigationAccordion;
