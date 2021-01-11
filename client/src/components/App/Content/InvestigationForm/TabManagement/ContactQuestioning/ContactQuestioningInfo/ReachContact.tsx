import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';

import ContactStatus from 'models/ContactStatus';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import InteractedContact from 'models/InteractedContact';
import useContactFields from 'Utils/Contacts/useContactFields';
import InteractedContactFields from 'models/enums/InteractedContact';

import useReachContact from './useReachContact';
import useStyles from '../ContactQuestioningStyles';

const ReachContact = (props: Props) => {
    const { control, getValues , watch } = useFormContext();
    const {
        interactedContact,
        index,
        contactStatuses,
        saveContact,
        parsePerson,
    } = props;
    const classes = useStyles({});

    const formValues = getValues().form
    ? getValues().form[index]
    : interactedContact;

    const watchContactStatus = watch(`form[${index}].contactStatus`)
    const currentContactStatus = watchContactStatus ? watchContactStatus : formValues.contactStatus;
    const foundValue = contactStatuses.find(
        (contactStatus: ContactStatus) =>
            contactStatus.id === currentContactStatus
    );
    const currentValue = foundValue || { id : -1 , displayName : "..."}
    const { isFieldDisabled } = useContactFields(formValues.contactStatus);

    const { changeContactStatus } = useReachContact({
        saveContact,
        parsePerson,
        formValues,
        index,
    });

    return (
        <div className={classes.reachContact}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Controller
                        control={control}
                        name={`form[${index}].${InteractedContactFields.CONTACT_STATUS}`}
                        defaultValue={interactedContact.contactStatus}
                        render={(props) => {
                            return (
                                <Autocomplete
                                    disabled={isFieldDisabled}
                                    className={classes.statusAutoComplete}
                                    options={contactStatuses}
                                    getOptionLabel={(option) =>
                                        option.displayName
                                    }
                                    value={currentValue}
                                    onChange={(e, data) =>
                                        changeContactStatus(
                                            e,
                                            data,
                                            props.onChange
                                        )
                                    }
                                    closeIcon={false}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder='סטטוס'
                                            onClick={(event) => 
                                                event.stopPropagation()
                                            }
                                            InputProps={{
                                                ...params.InputProps,
                                                value: currentValue?.displayName,
                                                className: classes.statusAutocompleteRoot
                                            }}
                                        />
                                    )}
                                />
                            );
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <span onClick={(event) => event.stopPropagation()}>
                        <PhoneDial
                            phoneNumber={interactedContact.phoneNumber}
                        />
                    </span>
                </Grid>
            </Grid>
        </div>
    );
};

export default ReachContact;

interface Props {
    interactedContact: InteractedContact;
    index: number;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: InteractedContact, index: number) => InteractedContact;
}
