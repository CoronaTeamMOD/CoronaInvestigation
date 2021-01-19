import React from 'react';
import { Accordion } from '@material-ui/core';

import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';


import AccordionContent from './AccordionContent/AccordionContent';
import AccordionHeadline from './AccordionHeadline/AccordionHeadline';

const InvestigationAccordion = (props: Props) => {
    const { epidemiologyNumber , contactEventsByInvestigationId , investigatedPatientByInvestigatedPatientId } = props.contact;
    const { fullName , identityNumber } = investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient;

    return (
        <Accordion>
            <AccordionHeadline
                epidemiologyNumber={epidemiologyNumber}
                fullName={fullName}
                identityNumber={identityNumber}
            />
            <AccordionContent 
                events={contactEventsByInvestigationId.nodes}
            />
        </Accordion>
    )
}

interface Props {
    contact : ConnectedInvestigation;
}

export default InvestigationAccordion;
