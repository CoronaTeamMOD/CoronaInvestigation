import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { Tooltip, Typography, Grid, Button, MenuItem, Menu } from '@material-ui/core';

import ContactType from 'models/ContactType';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import InvalidFormIcon from 'commons/Icons/InvalidFormIcon';
import FamilyContactIcon from 'commons/Icons/FamilyContactIcon';
import useInvolvedContact from 'Utils/vendor/useInvolvedContact';
import GroupedContactIcon from 'commons/Icons/GroupedContactIcon';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import GetGroupedInvestigationsIds from 'Utils/GroupedInvestigationsContacts/getGroupedInvestigationIds';

import useStyles from '../ContactQuestioningStyles';
import { useEffect } from 'react';
import { contactQuestioningService } from 'services/contactQuestioning.service';

const TIGHT_CONTACT_STATUS = 1;

const ContactDetails = (props: Props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: any) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleClickStopPropagation = (event: any) => {
        event.stopPropagation();
    };

    const { interactedContact, formState } = props;
    const classes = useStyles({});

    const [showRulerStatusInfo, setShowRulerStatusInfo] = useState<boolean>(false);
    const [duplicateIdentities, setDuplicateIdentities] = useState<boolean>(false);

    const { isInvolvedThroughFamily } = useInvolvedContact();
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(
        (state) => state.contactTypes
    );

    const { isGroupedContact } = GetGroupedInvestigationsIds();

    const highestContactType = interactedContact.contactEvents.reduce((prev, current) => {
        if (current.contactType === TIGHT_CONTACT_STATUS) {
            if (prev.contactType === TIGHT_CONTACT_STATUS) {
                return (new Date(prev.date).getTime() > new Date(current.date).getTime()) ? prev : current
            }
            return current
        }
        return prev;
    });


    const finalEpidemiologicalStatusDesc = interactedContact.finalEpidemiologicalStatusDesc;

    const tooltipText = highestContactType.contactType === TIGHT_CONTACT_STATUS
        ? formatDate(highestContactType.date)
        : '';

    useEffect(() => {
        contactQuestioningService.checkForDuplicates();
        return (() => {
            contactQuestioningService.getDuplicateIdentities().subscribe().unsubscribe();
        })
    }, [])

    contactQuestioningService.getDuplicateIdentities().subscribe(duplicates => {
        const isDuplicateIdentity = duplicates.filter(obj => obj.identityType ===interactedContact.identificationType?.id && obj.identityNumber ===interactedContact.identificationNumber).length > 0;
        setDuplicateIdentities(isDuplicateIdentity);
    })

    const renderRulerButtonAndStatusInfo = () => {
        return (
            <>
                <Button
                    aria-controls='simple-menu' aria-haspopup='true'
                    className={classes.statusInfoBtn}
                    onClick={handleClick}
                >
                    {!anchorEl && <ExpandLess />}
                    {!!anchorEl && <ExpandMore />}
                    <Typography variant='body2' className={classes.contactDetail}>
                        <b>מרכיבי הסטטוס:</b>{' '}
                    </Typography>
                </Button>

                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    className={classes.statusInfoMenu}
                    open={!!anchorEl}
                    onClose={handleClose}
                    onClick={handleClickStopPropagation}
                >
                    <MenuItem >
                        <Grid container>
                            <Typography variant='body2' className={classes.rulerFieldInfo}>תחלואה: </Typography>
                            <Typography variant='body2' className={classes.contactDetail}>
                                <b>{interactedContact.caseStatusDesc}</b>
                            </Typography>
                        </Grid>
                    </MenuItem>
                    <MenuItem>
                        <Grid container>
                            <Typography variant='body2' className={classes.rulerFieldInfo}> חסינות סרולוגית: </Typography>
                            <Typography variant='body2' className={classes.contactDetail}>
                                <b>{interactedContact.immuneDefinitionBasedOnSerologyStatusDesc}</b>
                            </Typography>
                        </Grid>
                    </MenuItem>
                    <MenuItem>
                        <Grid container>
                            <Typography variant='body2' className={classes.rulerFieldInfo}>התחסנות: </Typography>
                            <Typography variant='body2' className={classes.contactDetail}>
                                <b>{interactedContact.vaccinationStatusDesc}</b>
                            </Typography>
                        </Grid>
                    </MenuItem>
                    <MenuItem>
                        <Grid container>
                            <Typography variant='body2' className={classes.rulerFieldInfo}>דיווח בידוד:</Typography>
                            <Typography variant='body2' className={classes.contactDetail}>
                                <b>{interactedContact.isolationReportStatusDesc}</b>
                            </Typography>
                        </Grid>
                    </MenuItem>
                    <MenuItem>
                        <Grid container item>
                            <Typography variant='body2' className={classes.rulerFieldInfo}>חובת בידוד:</Typography>
                            <Typography variant='body2' className={classes.contactDetail}>
                                <b>{interactedContact.isolationObligationStatusDesc}</b>
                            </Typography>
                        </Grid>
                    </MenuItem>
                </Menu>
            </>
        )
    }

    return (
        <>
            {isInvolvedThroughFamily(interactedContact.involvementReason) && (
                <FamilyContactIcon />
            )}
            {isGroupedContact(interactedContact.identificationNumber) && (
                <GroupedContactIcon />
            )}
            {
                (formState?.isValid === false || duplicateIdentities) && <InvalidFormIcon />
            }
            <Grid
                container
                item
                xs={10}
                direction='row-reverse'
                alignItems='center'
                justify='space-evenly'
            >
                <Typography variant='body2' className={classes.contactDetail}>
                    <b>שם פרטי:</b>{' '}
                    {interactedContact.firstName}
                </Typography>
                <Typography variant='body2' className={classes.contactDetail}>
                    <b>שם משפחה:</b>{' '}
                    {interactedContact.lastName}
                </Typography>
                {interactedContact.contactEvents && (
                    <Tooltip title={tooltipText} placement='top' arrow>
                        <Typography variant='body2'>
                            <b>סוג מגע:</b>{' '}
                            {
                                contactTypes.get(highestContactType.contactType)
                                    ?.displayName
                            }
                        </Typography>
                    </Tooltip>
                )}
                <Typography variant='body2' className={classes.contactDetail}>
                    <b>סטטוס אפידמיולוגי מסכם:</b>{' '}
                    {finalEpidemiologicalStatusDesc}

                </Typography>
                <>{renderRulerButtonAndStatusInfo()}</>
            </Grid>
        </>
    );
};

export default ContactDetails;

interface Props {
    interactedContact: GroupedInteractedContact;
    formState: any;
    index: number;
};