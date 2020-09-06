import React from 'react';
import { format } from 'date-fns';
import { Card, Collapse, IconButton, Typography, Grid, Divider } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowLeft, Edit, Delete } from '@material-ui/icons';

import Interaction from 'models/Interaction';

import useStyle from './InteractionCardStyles';

const InteractionCard: React.FC<Props> = (props: Props) => {

    const [areDetailsOpen, setAreDetailsOpen] = React.useState<boolean>(false);

    const { interaction } = props;

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
                    <IconButton>
                        <Edit />
                    </IconButton>
                    <IconButton>
                        <Delete />
                    </IconButton>
                </div>
            </div>
            <Collapse in={areDetailsOpen}>
                <Grid container className={classes.gridContainer}>
                    {/* place name row */}
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
                    {/* place address row */}
                    <Grid item xs={2}>
                        <Typography>
                            <b> כתובת: </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography>
                            {interaction.placeAddress}
                        </Typography>
                    </Grid>
                    {/* place number row */}
                    <Grid item xs={2}>
                        <Typography>
                            <b>טלפון המקום: </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography>
                            {interaction.placeNumber}
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
                            {format(interaction.interactionEndTime, 'HH:mm')} - {format(interaction.interactionStartTime, 'HH:mm')}
                        </Typography>
                    </Grid>
                </Grid>
                <Divider className={classes.divider} />
                {/* Contacted persons section */}
                <Grid container className={classes.gridContainer}>
                    <Grid item xs={12}>
                        <Typography>
                            <b>אנשים שהיו באירוע: ({interaction.interactionPersons.length})</b>
                        </Typography>
                    </Grid>
                    {interaction.interactionPersons.map(person => (
                        <>
                            <Grid item xs={2}>
                                <Typography>
                                    <b>שם: </b>
                                    {person.name}
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
    interaction: Interaction
}

export default InteractionCard;