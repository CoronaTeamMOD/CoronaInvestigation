import React from 'react';
import { AccordionDetails } from '@material-ui/core';

import ContactEvent from 'models/GroupedInvestigationContacts/ContactEvent';

interface Props {
    events : ContactEvent[]
}

const AccordionContent = (props: Props) => {
    return (
        <AccordionDetails>
            <div>helo</div>
        </AccordionDetails>
    )
}

export default AccordionContent
