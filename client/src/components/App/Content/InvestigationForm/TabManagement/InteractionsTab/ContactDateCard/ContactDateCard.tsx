import React from 'react';
import { format } from 'date-fns';
import { KeyboardArrowDown, KeyboardArrowLeft } from '@material-ui/icons';
import { Card, Typography, IconButton, Collapse } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import DayOfWeek from 'models/enums/DayOfWeek';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './ContactDateCardStyles';
import InteractionCard from './InteractionCard/InteractionCard';
import RepetitiveEventIcon from './RepetitiveEventIcon';

const ContactDateCard: React.FC<Props> = (props: Props) => {

    const { contactDate, interactions, createNewInteractionEvent,
        onEditClick, onDeleteClick, loadInteractions, loadInvolvedContacts, onDeleteContactClick, allInteractions, isViewMode } = props;

    const [areInteractionsOpen, setAreInteractionsOpen] = React.useState<boolean>(false);

    const { isInvolvedThroughFamily } = useInvolvedContact();

    const areThereFamilyContacts = (interaction: Interaction) => interaction.contacts.some(contact => isInvolvedThroughFamily(contact.involvedContact?.involvementReason || null))

    const classes = useStyles();
    const formClasses = useFormStyles();

    return (
        <Card test-id='contactLocationDateCard' key={contactDate.getTime()} className={classes.investigatedDateCard}>
            <div className={classes.dateInfo} onClick={() => setAreInteractionsOpen(!areInteractionsOpen)}>
                <div className={classes.dateSection}>
                    <div className={classes.arrowWrapper}>
                        {
                            interactions !== undefined &&
                            <IconButton test-id={'collpaseContactLocationDate'}>
                                {areInteractionsOpen ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
                            </IconButton>
                        }
                    </div>
                    <Typography variant='body1'>
                        יום {DayOfWeek[contactDate.getDay()] + ' '}
                        {format(contactDate, 'dd/MM/yyyy')}
                    </Typography>
                    {interactions?.some(interaction => interaction.isRepetitive) && <RepetitiveEventIcon />}
                </div>
                {
                    interactions !== undefined &&
                    <div className={classes.infoSection}>
                        <Typography>
                            סה"כ מקומות: {interactions?.length} | סה"כ אנשים: {interactions?.map(interaction => interaction.contacts.length).reduce((sum, currentElement) => sum += currentElement)}
                        </Typography>
                    </div>
                }
                <PrimaryButton test-id='openNewContactLocation' onClick={() => createNewInteractionEvent()} disabled={isViewMode}>
                    צור מקום/מגע
                </PrimaryButton>
            </div>
            <Collapse classes={{ hidden: formClasses.hidden }} in={areInteractionsOpen}>
                {interactions?.map(interaction =>
                    <InteractionCard
                        allInteractions={allInteractions}
                        loadInteractions={loadInteractions}
                        loadInvolvedContacts={loadInvolvedContacts}
                        onEditClick={() => onEditClick(interaction)}
                        onDeleteContactClick={onDeleteContactClick}
                        onDeleteClick={() => interaction.id && onDeleteClick(interaction.id, areThereFamilyContacts(interaction))}
                        key={interaction.id ? interaction.id : interaction.startTime.getTime()} interaction={interaction} />
                )}
            </Collapse>
        </Card>
    )
}

interface Props {
    allInteractions: Interaction[];
    contactDate: Date;
    interactions: Interaction[] | undefined;
    createNewInteractionEvent: () => void;
    onEditClick: (interaction: Interaction) => void;
    onDeleteClick: (contactEventId: number, areThereFamilyContacts: boolean) => void;
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    onDeleteContactClick: (contactedPersonId: number, involvedContactId: number | null) => void;
    isViewMode?: boolean;
};

export default ContactDateCard;
