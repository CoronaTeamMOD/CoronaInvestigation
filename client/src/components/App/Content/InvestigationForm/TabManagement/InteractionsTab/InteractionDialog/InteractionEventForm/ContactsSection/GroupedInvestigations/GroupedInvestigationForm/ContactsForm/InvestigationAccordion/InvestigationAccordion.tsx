import React from 'react';
import { Accordion } from '@material-ui/core';

import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

import useStyles from './accordionStyles';
import UseDuplicateConnectedIds from './UseDuplicateConnectedIds';
import AccordionContent from './AccordionContent/AccordionContent';
import AccordionHeadline from './AccordionHeadline/AccordionHeadline';

const InvestigationAccordion = (props: Props) => {
    const { investigation, isGroupReasonFamily} = props;
    const { epidemiologyNumber , contactEventsByInvestigationId , investigatedPatientByInvestigatedPatientId } = investigation;
    const { fullName , identityNumber } = investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient;

    const duplicateIds = UseDuplicateConnectedIds(epidemiologyNumber);

    const classes = useStyles();

    return (
        <Accordion className={classes.accordion}>
            <AccordionHeadline
                epidemiologyNumber={epidemiologyNumber}
                fullName={fullName}
                identityNumber={identityNumber}
            />
            <AccordionContent 
                isGroupReasonFamily={isGroupReasonFamily}
                events={contactEventsByInvestigationId.nodes}
                duplicateIds={duplicateIds}
            />
        </Accordion>
    )
}

interface Props {
    isGroupReasonFamily: boolean;
    investigation: ConnectedInvestigation;
}

export default InvestigationAccordion;
