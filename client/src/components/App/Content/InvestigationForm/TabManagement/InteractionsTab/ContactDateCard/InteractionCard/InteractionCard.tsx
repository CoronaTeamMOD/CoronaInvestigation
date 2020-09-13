import React from 'react';
import { format } from 'date-fns';
import { Card, Collapse, IconButton, Typography, Grid, Divider } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowLeft, Edit, Delete } from '@material-ui/icons';

import { timeFormat } from 'Utils/displayUtils';
import Interaction from 'models/Contexts/InteractionEventDialogData';

import useStyle from './InteractionCardStyles';

const InteractionCard: React.FC<Props> = (props: Props) => {

    const [areDetailsOpen, setAreDetailsOpen] = React.useState<boolean>(false);

    const { interaction, onEditClick } = props;

    const classes = useStyle();

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
                    <IconButton onClick={onEditClick}>
                        <Edit />
                    </IconButton>
                    <IconButton>
                        <Delete />
                    </IconButton>
                </div>
            </div>
            <Collapse in={areDetailsOpen}>
                <Grid container className={classes.gridContainer}>
                    {/* location name row */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>שם המקום: </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography>
                            {interaction.placeName}
                        </Typography>
                    </Grid>
                    {/* location address row */}
                    <Grid item xs={2}>
                        <Typography>
                            <b> כתובת: </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography>
                            {interaction.locationAddress.address?.description}
                        </Typography>
                    </Grid>
                    {/* location number row */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>טלפון המקום: </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography>
                            {interaction.contactPersonPhoneNumber}
                        </Typography>
                    </Grid>
                    {/* time row */}
                    <Grid item xs={2}>
                        <Typography>
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
                {/* Contacted persons section */}
                <Grid container className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <Typography>
                            <b>אנשים שהיו באירוע: ({interaction.contacts.length})</b>
                        </Typography>
                    </Grid>
                    {interaction.contacts.map(person => (
                        <>
                            <Grid item xs={2}>
                                <Typography>
                                    <b>שם: </b>
                                    {`${person.firstName} ${person.lastName}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>
                                    <b>ת.ז: </b>
                                    {person.id}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography>
                                    <b>טלפון: </b>
                                    {person.phoneNumber}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} />
                        </>
                    ))}
                </Grid>
            </Collapse>
        </Card>
    );
}

interface Props {
    interaction: Interaction,
    onEditClick: () => void
}

export default InteractionCard;