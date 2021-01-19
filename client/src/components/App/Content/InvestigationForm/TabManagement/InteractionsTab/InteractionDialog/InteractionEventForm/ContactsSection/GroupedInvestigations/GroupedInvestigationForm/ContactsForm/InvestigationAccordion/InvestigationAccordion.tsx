import React from 'react';
import { Accordion , AccordionSummary , AccordionDetails } from '@material-ui/core';


import { ConnectedInvestigation } from '../../ConnectedInvestigationContact';
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
            <AccordionDetails>
                <div>helo</div>
            </AccordionDetails>
        </Accordion>
    )
}

interface Props {
    contact : ConnectedInvestigation;
}

export default InvestigationAccordion;
