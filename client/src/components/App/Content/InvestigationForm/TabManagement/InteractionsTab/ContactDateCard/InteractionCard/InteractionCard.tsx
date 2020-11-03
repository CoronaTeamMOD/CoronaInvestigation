import React from 'react';
import { format } from 'date-fns';
import { KeyboardArrowDown, KeyboardArrowLeft, Edit, Delete } from '@material-ui/icons';
import { Card, Collapse, IconButton, Typography, Grid, Divider } from '@material-ui/core';

import { timeFormat } from 'Utils/displayUtils';
import Interaction from 'models/Contexts/InteractionEventDialogData';
import Contact from 'models/Contact';

import placeTypesCodesHierarchy from 'Utils/placeTypesCodesHierarchy';
import useContactFields from 'Utils/vendor/useContactFields';

import ContactGrid from './ContactGrid/ContactGrid';
import ContactUploader from './ExcelUploader/ContactUploader';
import OfficeEventGrid from './PlacesAdditionalGrids/OfficeEventGrid';
import SchoolEventGrid from './PlacesAdditionalGrids/SchoolEventGrid';
import MedicalLocationGrid from './PlacesAdditionalGrids/MedicalLocationGrid';
import DefaultPlaceEventGrid from './PlacesAdditionalGrids/DefaultPlaceEventGrid';
import ExcelFormatDownloader from './ExcelFormatDownloader/ExcelFormatDownloader';
import PrivateHouseEventGrid from './PlacesAdditionalGrids/PrivateHouseEventGrid';
import OtherPublicLocationGrid from './PlacesAdditionalGrids/OtherPublicLocationGrid';
import TransportationEventGrid from './PlacesAdditionalGrids/TransportationAdditionalGrids/TransportationEventGrid';

import useStyles from './InteractionCardStyles';

const { geriatric, school, medical, office, otherPublicPlaces, privateHouse, religion, transportation } = placeTypesCodesHierarchy;

const InteractionCard: React.FC<Props> = (props: Props) => {
    const classes = useStyles();

    const { interaction, onEditClick, onDeleteClick, onDeleteContactClick } = props;

    const [areDetailsOpen, setAreDetailsOpen] = React.useState<boolean>(false);

    const {getDisabledFields} = useContactFields();
    const completedContacts = getDisabledFields(interaction.contacts);
    const isFieldDisabled = (contactId: Contact['serialId']) => !!completedContacts.find(contact => contact.serialId === contactId);

    return (
        <Card className={classes.container}>
            <div className={[classes.rowAlignment, classes.spaceBetween].join(' ')}>
                <div className={classes.rowAlignment}>
                    <IconButton color='primary' onClick={() => setAreDetailsOpen(!areDetailsOpen)}>
                        {areDetailsOpen ? <KeyboardArrowDown /> : <KeyboardArrowLeft />}
                    </IconButton>
                    <Typography>
                        <b>
                            {interaction.placeName}
                        </b>
                    </Typography>
                </div>
                <div>
                    <IconButton test-id={'editContactLocation'} onClick={onEditClick}>
                        <Edit />
                    </IconButton>
                    <IconButton test-id={'deleteContactLocation'}
                                disabled={completedContacts?.length > 0}
                                onClick={onDeleteClick}>
                        <Delete />
                    </IconButton>
                </div>
            </div>
            <Collapse in={areDetailsOpen}>
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
                    <Grid container justify='flex-start'>
                        <Grid item xs={2}>
                            <Typography variant='caption'>
                                <b>שעה: </b>
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>
                                {format(interaction.endTime, timeFormat)} - {format(interaction.startTime, timeFormat)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider className={classes.divider} />
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography>
                                <b>אנשים שהיו באירוע: ({interaction.contacts.length})</b>
                            </Typography>
                            <ExcelFormatDownloader />
                            {interaction.id && <ContactUploader contactEvent={interaction.id} onSave={props.loadInteractions} />}
                        </Grid>
                        {interaction.contacts.map(person => (
                            <Grid item xs={12} className={classes.interactionItem}>
                                <ContactGrid
                                    isContactComplete={isFieldDisabled(person.serialId)}
                                    contact={person}
                                    onDeleteContactClick={onDeleteContactClick}
                                    eventId={interaction.id ? interaction.id : -1}
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
    interaction: Interaction;
    onEditClick: () => void;
    onDeleteClick: () => void;
    loadInteractions: () => void;
    onDeleteContactClick: (contactedPersonId: number, contactEventId: number) => void;
};

export default InteractionCard;