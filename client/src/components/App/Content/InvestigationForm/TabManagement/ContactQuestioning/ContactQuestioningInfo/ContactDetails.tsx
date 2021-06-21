import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { useFormContext } from 'react-hook-form';
import { Tooltip, Typography, Grid } from '@material-ui/core';

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

const TIGHT_CONTACT_STATUS = 1;

const ContactDetails = (props: Props) => {

    const { errors } = useFormContext();
    const { index , interactedContact } = props;
    const classes = useStyles({});

    const [showRulerStatusInfo, setShowRulerStatusInfo] = useState<boolean>(false);

    const formErrors = errors.form ? (errors.form[index] ? errors.form[index] : {}) : {};
    const formHasErrors = Object.entries(formErrors)
        .some(([key, value]) => value !== undefined);

    const { isInvolvedThroughFamily } = useInvolvedContact();
    const contactTypes = useSelector<StoreStateType, Map<number, ContactType>>(
        (state) => state.contactTypes
    );

    const { isGroupedContact } = GetGroupedInvestigationsIds();

    const highestContactType = interactedContact.contactEvents.reduce((prev, current) => {
        if(current.contactType === TIGHT_CONTACT_STATUS)  {
            if(prev.contactType === TIGHT_CONTACT_STATUS) {
                return (new Date(prev.date).getTime() > new Date(current.date).getTime()) ? prev : current
            }
            return current
        }
        return prev;
    });

    const handleStatusInfoClick = (event: React.ChangeEvent<{}>) => {
        event.stopPropagation();
        setShowRulerStatusInfo(!showRulerStatusInfo);
    };
    const colorCode = 'אין נתונים'//interactedContact.colorCode;
    
    const generateBackgroundColorClass = (colorCode: Number | any) => {
        switch (colorCode) {
            case 1:
                return classes.red;
            case 2:
                return classes.orange;
            case 3:
                return classes.green;
            case 4:
                return classes.yellow;
            default:
                return classes.white;
        }
    }
    const backgroundColorClass: any  = generateBackgroundColorClass(colorCode)
    const finalEpidemiologicalStatusDesc = 'אין נתונים'//interactedContact.finalEpidemiologicalStatusDesc;

    const tooltipText = highestContactType.contactType === TIGHT_CONTACT_STATUS 
        ? formatDate(highestContactType.date)
        : '';

    const renderRulerStatusInfo = () => {
        return (
            <Grid 
                container
                xs={12}
                direction='row-reverse'
                justify='flex-start'
                className={classes.statusInfo}
            >
                <Grid container item xs={2} direction='column'>
                    <Typography variant='body2' className={classes.contactDetail }>
                    תחלואה:
                    </Typography>
                    <Typography variant='body2' className={classes.contactDetail }>
                    <b>אין נתונים</b> 
                    {/* interactedContact.certificateEligibilityTypeDesc */}
                    </Typography>
                </Grid>
                <Grid container item xs={3} direction='column'>
                    <Typography variant='body2' className={classes.contactDetail }>
                    חסינות סרולוגית:
                    </Typography>
                    <Typography variant='body2' className={classes.contactDetail }>
                    <b>אין נתונים</b> 
                    {/* interactedContact.immuneDefinitionBasedOnSerologyStatusDesc  */}
                    </Typography>
                </Grid>
                <Grid container item xs={2} direction='column'>
                    <Typography variant='body2' className={classes.contactDetail }>
                    התחסנות:
                    </Typography>
                    <Typography variant='body2' className={classes.contactDetail }>
                    <b>אין נתונים</b> 
                    {/* interactedContact.vaccinationStatusDesc  */}
                    </Typography>
                </Grid>
                <Grid container item xs={2} direction='column'>
                    <Typography variant='body2' className={classes.contactDetail }>
                    דיווח בידוד:
                    </Typography>
                    <Typography variant='body2' className={classes.contactDetail }>
                    <b>אין נתונים</b> 
                    {/* interactedContact.isolationReportStatusDesc  */}
                    </Typography>
                </Grid>
                <Grid container item xs={2} direction='column'>
                    <Typography variant='body2' className={classes.contactDetail }>
                    חובת בידוד:
                    </Typography>
                    <Typography variant='body2' className={classes.contactDetail }>
                    <b>אין נתונים</b> 
                    {/* interactedContact.isolationObligationStatusDesc  */}
                    </Typography>
                </Grid>
            </Grid>
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
                formHasErrors && <InvalidFormIcon />
            }
             <Grid
                container
                item
                xs={10}
                direction='row-reverse'
                alignItems='center'
                justify='space-evenly'
                className={backgroundColorClass}
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
                <Grid 
                    className={classes.statusInfoBtn}
                    container
                    direction='row-reverse'
                    xs={3}
                    justify='flex-end'
                    onClick={handleStatusInfoClick}
                >
                    <Typography variant='body2' className={classes.contactDetail }>
                    <b>מרכיבי הסטטוס:</b>{' '}
                    </Typography>
                    {!showRulerStatusInfo &&<ExpandLess/>}
                    {showRulerStatusInfo &&<ExpandMore/>}
                </Grid>
                {showRulerStatusInfo && 
                    <Grid 
                        className={classes.statusInfoBtn}
                        container
                        direction='row-reverse'
                    >
                        {renderRulerStatusInfo()}
                    </Grid>
                }
            </Grid>
        </>
    );
};

export default ContactDetails;

interface Props {
    interactedContact: GroupedInteractedContact;
    index : number;
};