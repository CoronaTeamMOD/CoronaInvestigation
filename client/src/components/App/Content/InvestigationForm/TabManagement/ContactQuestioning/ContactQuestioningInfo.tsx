import React from 'react';
import { Divider, Grid } from '@material-ui/core';

import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

import ReachContact from './ContactQuestioningInfo/ReachContact';
import ContactDetails from './ContactQuestioningInfo/ContactDetails';

const ContactQuestioningInfo: React.FC<Props> = (props: Props): JSX.Element => {
    const {
        index,
        interactedContact,
        contactStatuses,
        saveContact,
        parsePerson,
        isViewMode
    } = props;

    return (
        <>
            <Grid item xs={3} container>
                <ReachContact
                   // interactedContact={interactedContact}
                    index={index}
                    contactStatuses={contactStatuses}
                    saveContact={saveContact}
                    parsePerson={parsePerson}
                    isViewMode={isViewMode}
                />
                <Divider variant='fullWidth' orientation='vertical' flexItem />
            </Grid>
            <Grid
                container
                item
                xs={10}
                direction='row-reverse'
                alignItems='center'
                justify='space-evenly'
            >
                <ContactDetails index={index} /*interactedContact={interactedContact}*/ />
            </Grid>
        </>
    );
};

export default ContactQuestioningInfo;

interface Props {
    index: number;
    interactedContact: GroupedInteractedContact;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact, index: number) => InteractedContact;
    isViewMode?: boolean;
}
