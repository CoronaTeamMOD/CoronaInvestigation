import { format } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, MenuItem, Select, Typography } from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import InteractionContact from 'models/InteractionContact';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import { useStyles } from './InteractionsQuestioningStyles';
import useInteractionsQuestioning from './useInteractionsQuestioning';

const InteractionsQuestioning: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const interactions = useSelector<StoreStateType, Interaction[]>(state => state.interactions);

    let interactionContacts: InteractionContact[] = [];
    const numberOfContacts: number = interactions?.map(interaction => interaction.contacts.length).reduce((sum, currentElement) => sum += currentElement);

    const [currentInteractionContactId, setCurrentInteractionContactId] = useState<number>();
    const [currentInteractionContact, setCurrentInteractionContact] = useState<InteractionContact>();
    
    React.useEffect(() => {
        setCurrentInteractionContact(interactionContacts.find((interactionContact: InteractionContact) => interactionContact.id === currentInteractionContactId) as InteractionContact);
    },[currentInteractionContactId]);

    useInteractionsQuestioning({ interactionContacts, interactions });

    return (
        <div>
            <Typography variant='h6' className={classes.title}>טופס תשאול מגעים ({numberOfContacts})</Typography>
            {
                <FormControl className={classes.select} required>
                <Select
                    label='מגע'
                    value={currentInteractionContact}
                    onChange={(event) => {
                        setCurrentInteractionContactId(event.target.value as number);
                    }}
                >
                    {
                        interactionContacts.map((interactionContact: InteractionContact) => (
                            <MenuItem
                                key={interactionContact.id}
                                value={interactionContact.id}
                            >
                                <div className={classes.menuItems}>
                                    <div className={classes.menuItem}><b>שם פרטי: </b>{interactionContact.firstName}</div>
                                    <div className={classes.menuItem}><b>שם משפחה: </b>{interactionContact.lastName}</div>
                                    <div className={classes.menuItem}><b>מספר טלפון: </b>{interactionContact.phoneNumber}</div>
                                    <div className={classes.menuItem}><b>תאריך המגע: </b>{format(new Date(interactionContact.contactDate), 'dd/MM/yyyy')}</div>
                                    {interactionContact.contactType &&
                                        <div className={classes.menuItem}><b>סוג מגע: </b>{interactionContact.contactType}</div>
                                    }
                                    {interactionContact.extraInfo &&
                                        <div className={classes.menuItem}><b>פירוט אופי המגע: </b>{interactionContact.extraInfo}</div>
                                    }
                                </div>
                            </MenuItem>
                        ))
                    }
                </Select>
                </FormControl>
            }
        </div>
    );
};

export default InteractionsQuestioning;
