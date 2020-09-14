import React from 'react';
import { format } from 'date-fns';
import { KeyboardArrowDown, KeyboardArrowLeft } from '@material-ui/icons';
import { Card, Typography, IconButton, Collapse } from '@material-ui/core';

import Interaction from 'models/Contexts/InteractionEventDialogData';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyle from './ContactDateCardStyles'
import InteractionCard from './InteractionCard/InteractionCard';

const ContactDateCard: React.FC<Props> = (props: Props) => {

    const { contactDate, interactions, createNewInteractionEvent, onEditClick } = props;

    const [areInteractionsOpen, setAreInteractionsOpen] = React.useState<boolean>(false);

    const classes = useStyle();

    return (
        <Card test-id='contactLocationDateCard' key={contactDate.getTime()} className={classes.investigatedDateCard}>
            <div className={classes.dateInfo}>
                <div className={classes.dateSection}>
                    <IconButton onClick={() => setAreInteractionsOpen(!areInteractionsOpen)}>
                        {interactions !== undefined && (areInteractionsOpen ? <KeyboardArrowDown /> : <KeyboardArrowLeft />)}
                    </IconButton>
                    <Typography variant='body1'>{format(contactDate, 'dd/MM/yyyy')}</Typography>
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
            <Collapse in={areInteractionsOpen}>
                {interactions?.map(interaction =>
                    <InteractionCard
                        onEditClick={() => onEditClick(interaction)}
                        key={interaction.id ? interaction.id : interaction.startTime.getTime()} interaction={interaction} />
                )}
            </Collapse>
        </Card>
    )
}

interface Props {
    contactDate: Date;
    interactions: Interaction[] | undefined;
    createNewInteractionEvent: () => void;
    onEditClick: (interaction: Interaction) => void
}

export default ContactDateCard;