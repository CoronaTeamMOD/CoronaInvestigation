import React from 'react';
import { format } from 'date-fns';
import { KeyboardArrowDown, KeyboardArrowLeft } from '@material-ui/icons';
import { Card, Typography, IconButton, Collapse } from '@material-ui/core';

import useFormStyles from 'styles/formStyles';
import DayOfWeek from 'models/enums/DayOfWeek';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import ErrorIcon from 'commons/Icons/errorIcon/ErrorIcon';

import useStyles from './ContactDateCardStyles';
import InteractionCard from './InteractionCard/InteractionCard';
import RepetitiveEventIcon from './RepetitiveEventIcon';

const ContactDateCard: React.FC<Props> = (props: Props) => {

    const { contactDate, interactions, createNewInteractionEvent,
        onEditClick, onDeleteClick, loadInteractions, loadInvolvedContacts, onDeleteContactClick, allInteractions, isViewMode, noDate } = props;

    const [areInteractionsOpen, setAreInteractionsOpen] = React.useState<boolean>(false);

    const { isInvolvedThroughFamily } = useInvolvedContact();

    const areThereFamilyContacts = (interaction: Interaction) => interaction.contacts.some(contact => isInvolvedThroughFamily(contact.involvedContact?.involvementReason || null))

    const classes = useStyles();
    const formClasses = useFormStyles();

    const isThereMoreVerifiedOnInteraction = () =>{
        if(interactions){
            for (const interaction of interactions) {
                if(interaction.isThereMoreVerified){
                    return true;
                }
            }
        } 
        
        return false;
    }

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
                    {!noDate ? <Typography variant='body1'>
                            יום {DayOfWeek[contactDate.getDay()] + ' '}
                            {format(contactDate, 'dd/MM/yyyy')}
                        </Typography> : <Typography variant='body1'>
                            הוספת מפגש עם מאומת לא בטווח התאריכים המוצגים
                        </Typography>
                    }
                    {interactions?.some(interaction => interaction.isRepetitive) && <RepetitiveEventIcon />}
                </div>
                {
                    interactions !== undefined &&
                    <div className={classes.infoSection}>
                        {isThereMoreVerifiedOnInteraction() && <ErrorIcon tooltipText='קיים מפגש עם מאומתים' ></ErrorIcon>}
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
    createNewInteractionEvent: (date?:Date) => void;
    onEditClick: (interaction: Interaction) => void;
    onDeleteClick: (contactEventId: number, areThereFamilyContacts: boolean) => void;
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    onDeleteContactClick: (contactedPersonId: number, involvedContactId: number | null) => void;
    isViewMode?: boolean;
    noDate: boolean;
};

export default ContactDateCard;
