import React from 'react';
import { Accordion } from '@material-ui/core';

import { IdToCheck } from 'Utils/Contacts/useDuplicateContactId';
import ConnectedInvestigation from 'models/GroupedInvestigationContacts/ConnectedInvestigation';

import useStyles from './accordionStyles';
import AccordionContent from './AccordionContent/AccordionContent';
import AccordionHeadline from './AccordionHeadline/AccordionHeadline';

const InvestigationAccordion = (props: Props) => {
    const { selectedRows , contact , setSelectedRows, allContactIds} = props;
    const { epidemiologyNumber , contactEventsByInvestigationId , investigatedPatientByInvestigatedPatientId } = contact;
    const { fullName , identityNumber } = investigatedPatientByInvestigatedPatientId.covidPatientByCovidPatient;

    const classes = useStyles();

    return (
        <Accordion className={classes.accordion}>
            <AccordionHeadline
                epidemiologyNumber={epidemiologyNumber}
                fullName={fullName}
                identityNumber={identityNumber}
            />
            <AccordionContent 
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                events={contactEventsByInvestigationId.nodes}
                allContactIds={allContactIds}
            />
        </Accordion>
    )
}

interface Props {
    selectedRows: number[];
    setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
    contact: ConnectedInvestigation;
    allContactIds: IdToCheck[];
}

export default InvestigationAccordion;
