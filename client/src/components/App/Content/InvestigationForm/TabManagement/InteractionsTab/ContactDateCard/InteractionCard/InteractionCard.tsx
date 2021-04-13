import React from 'react';
import { format } from 'date-fns';
import { KeyboardArrowDown, KeyboardArrowLeft, Edit, Delete } from '@material-ui/icons';
import { Card, Collapse, IconButton, Typography, Grid, Divider } from '@material-ui/core';

import Contact from 'models/Contact';
import useFormStyles from 'styles/formStyles';
import { timeFormat } from 'Utils/displayUtils';
import useContactFields from 'Utils/Contacts/useContactFields';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import placeTypesCodesHierarchy from 'Utils/ContactEvent/placeTypesCodesHierarchy';
import InteractionEventContactFields from 'models/enums/InteractionsEventDialogContext/InteractionEventContactFields';

import useStyles from './InteractionCardStyles';
import ContactGrid from './ContactGrid/ContactGrid';
import ContactUploader from './ExcelUploader/ContactUploader';
import OfficeEventGrid from './PlacesAdditionalGrids/OfficeEventGrid';
import SchoolEventGrid from './PlacesAdditionalGrids/SchoolEventGrid';
import MedicalLocationGrid from './PlacesAdditionalGrids/MedicalLocationGrid';
import InteractionGridItem from './PlacesAdditionalGrids/InteractionGridItem';
import DefaultPlaceEventGrid from './PlacesAdditionalGrids/DefaultPlaceEventGrid';
import ExcelFormatDownloader from './ExcelFormatDownloader/ExcelFormatDownloader';
import PrivateHouseEventGrid from './PlacesAdditionalGrids/PrivateHouseEventGrid';
import OtherPublicLocationGrid from './PlacesAdditionalGrids/OtherPublicLocationGrid';
import TransportationEventGrid from './PlacesAdditionalGrids/TransportationAdditionalGrids/TransportationEventGrid';
import RepetitiveEventIcon from "../RepetitiveEventIcon";

const unknownTimeMessage = 'זמן לא ידוע';

const { geriatric, school, medical, office, otherPublicPlaces, privateHouse, religion, transportation, other, event, house, education, shop, attraction} = placeTypesCodesHierarchy;

const InteractionCard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const formClasses = useFormStyles();

    const { interaction, allInteractions, onEditClick, onDeleteClick, onDeleteContactClick } = props;

    const [areDetailsOpen, setAreDetailsOpen] = React.useState<boolean>(false);
    
    const {getDisabledFields} = useContactFields();
    const completedContacts = getDisabledFields(interaction.contacts);
    const isFieldDisabled = (contactId: Contact[InteractionEventContactFields.ID]) => !!completedContacts.find(contact => contact.id === contactId);
    
    const { shouldDisableContact } = useStatusUtils();
    
    const shouldDisableDeleteInteraction = completedContacts?.length > 0 || shouldDisableContact(interaction.creationTime);

    return (
        <Card className={classes.container}>
            <div className={[classes.rowAlignment, classes.spaceBetween].join(' ')} onClick={() => setAreDetailsOpen(!areDetailsOpen)}>
                <div className={classes.rowAlignment}>
                    <IconButton color='primary'>
                        {areDetailsOpen ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <Typography>
                        <b>
                            {interaction.placeName}
                        </b>
                    </Typography>
                    {
                        interaction.isRepetitive && <RepetitiveEventIcon/>
                    }
                </div>
                <div>
                    <IconButton test-id={'editContactLocation'} onClick={onEditClick}>
                        <Edit />
                    </IconButton>
                    <IconButton test-id={'deleteContactLocation'}
                                disabled={shouldDisableDeleteInteraction}
                                onClick={onDeleteClick}>
                        <Delete />
                    </IconButton>
                </div>
            </div>
            <Collapse classes={{hidden: formClasses.hidden}} in={areDetailsOpen}>
                <Grid container justify='flex-start' className={classes.detailsGrid} >
                    {
                        interaction.placeType === privateHouse.code &&
                        <PrivateHouseEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === office.code &&
                        <OfficeEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === transportation.code &&
                        <TransportationEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === school.code &&
                        <SchoolEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === medical.code &&
                        <MedicalLocationGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === religion.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === geriatric.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === otherPublicPlaces.code &&
                        <OtherPublicLocationGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === other.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === event.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === house.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === education.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === attraction.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    {
                        interaction.placeType === shop.code &&
                        <DefaultPlaceEventGrid interaction={interaction} />
                    }
                    <InteractionGridItem 
                        containerSize={6} 
                        labelLengthMD={3}
                        labelLengthLG={2}
                        title='שעה'
                        content={
                            interaction.unknownTime 
                            ? unknownTimeMessage
                            : `${format(interaction.endTime, timeFormat)} - ${format(interaction.startTime, timeFormat)}`  
                        }
                    />
                    <Divider className={classes.divider} />
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography>
                                <b>אנשים שהיו באירוע: ({interaction.contacts.length})</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.excelControllers}>
                                <ExcelFormatDownloader />
                                {interaction.id && 
                                <ContactUploader 
                                    allInteractions={allInteractions}
                                    contactEvent={interaction.id}
                                    onSave={props.loadInteractions}
                                />}
                            </div>
                        </Grid>
                        {interaction.contacts.map(contact => (
                            <Grid item xs={12} className={classes.interactionItem}>
                                <ContactGrid
                                    isContactComplete={isFieldDisabled(contact.id)}
                                    contact={contact}
                                    onDeleteContactClick={onDeleteContactClick}
                                /> 
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Collapse>
        </Card>
    );
};

interface Props {
    allInteractions: Interaction[];
    interaction: Interaction;
    onEditClick: () => void;
    onDeleteClick: () => void;
    loadInteractions: () => void;
    loadInvolvedContacts: () => void;
    onDeleteContactClick: (contactedPersonId: number, involvedContactId: number | null) => void;
};

export default InteractionCard;
