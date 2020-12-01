import React from 'react';
import { format } from 'date-fns';
import { KeyboardArrowDown, KeyboardArrowLeft } from '@material-ui/icons';
import { Card, Typography, IconButton, Collapse } from '@material-ui/core';

import DayOfWeek from 'models/enums/DayOfWeek';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import useFormStyles from 'styles/formStyles';

import useStyles from './ContactDateCardStyles';
import InteractionCard from './InteractionCard/InteractionCard';

const ContactDateCard: React.FC<Props> = (props: Props) => {

    const { contactDate, interactions, createNewInteractionEvent,
        onEditClick, onDeleteClick, loadInteractions, onDeleteContactClick, allInteractions  } = props;

    const [areInteractionsOpen, setAreInteractionsOpen] = React.useState<boolean>(false);

    const classes = useStyles();
    const formClasses = useFormStyles();

    return (
        <Card test-id='contactLocationDateCard' key={contactDate.getTime()} className={classes.investigatedDateCard}>
            <div className={classes.dateInfo}>
                <div className={classes.dateSection}>
                    <div className={classes.arrowWrapper}>
                        {
                            interactions !== undefined && 
                            <IconButton test-id={'collpaseContactLocationDate'} onClick={() => setAreInteractionsOpen(!areInteractionsOpen)}>
                                {areInteractionsOpen ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
                            </IconButton>
                        }
                    </div>
                    <Typography variant='body1'>
                        יום {DayOfWeek[contactDate.getUTCDay()] + ' '}
                        {format(contactDate, 'dd/MM/yyyy')}
                    </Typography>
                </div>
                {
                    interactions !== undefined &&
                    <div className={classes.infoSection}>
                        <Typography>
                            סה"כ מקומות: {interactions?.length} | סה"כ אנשים: {interactions?.map(interaction => interaction.contacts.length).reduce((sum, currentElement) => sum += currentElement)}
                        </Typography>
                    </div>
                }
                <PrimaryButton test-id='openNewContactLocation' onClick={() => createNewInteractionEvent()}>
                    צור מקום/מגע
                </PrimaryButton>
            </div>
            <Collapse classes={{hidden: formClasses.hidden}} in={areInteractionsOpen}>
                {interactions?.map(interaction =>
                    <InteractionCard
                        allInteractions={allInteractions}
                        loadInteractions={loadInteractions}
                        onEditClick={() => onEditClick(interaction)}
                        onDeleteContactClick={onDeleteContactClick}
                        onDeleteClick={() => interaction.id && onDeleteClick(interaction.id)}
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
    onDeleteClick: (contactEventId: number) => void;
    loadInteractions: () => void;
    onDeleteContactClick: (contactedPersonId: number, contactEventId: number) => void;
};

export default ContactDateCard;