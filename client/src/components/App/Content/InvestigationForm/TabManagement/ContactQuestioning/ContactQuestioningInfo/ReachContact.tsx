import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField, Grid } from '@material-ui/core';
import { Controller, useFormContext } from 'react-hook-form';



import ContactStatus from 'models/ContactStatus';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import InteractedContact from 'models/InteractedContact';
import useContactFields, { ValidationReason } from 'Utils/Contacts/useContactFields';
import InteractedContactFields from 'models/enums/InteractedContact';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

import useReachContact from './useReachContact';
import useStyles from '../ContactQuestioningStyles';


const ReachContact = (props: Props) => {
    const methods = useFormContext<GroupedInteractedContact>();
    const { interactedContact, index, contactStatuses, saveContact,parsePerson,isViewMode } = props;
    const classes = useStyles({});
   
    const foundValue = (status: number) => {
        return contactStatuses.find((contactStatus: ContactStatus) => contactStatus.id === status);
    }
    const getCurrentValue = (status: number) => { return foundValue(status) || { id: -1, displayName: '...' } }
    const { isFieldDisabled, validateContact } = useContactFields(methods.getValues("contactStatus")/*interactedContact.contactStatus*/);

    const { changeContactStatus } = useReachContact({
        saveContact, parsePerson, formValues: methods.getValues() /*interactedContact*/, index
    });

    const removeUnusePartOfError = (errorMsg: string) => {
        errorMsg = errorMsg.replace('לא מילאת את שדות', '');
        errorMsg = errorMsg.replace('לא מילאת את שדה', '');
        return errorMsg;
    }

    return (
        <div className={classes.reachContact}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Controller
                        control={methods.control}
                        name={`${InteractedContactFields.CONTACT_STATUS}`}
                        defaultValue={interactedContact.contactStatus}
                        render={(props) => {
                            const currentValue = getCurrentValue(props.value);
                            return (
                                <Autocomplete
                                    disabled={isFieldDisabled || isViewMode}
                                    className={classes.statusAutoComplete}
                                    options={contactStatuses}
                                    getOptionLabel={(option) =>
                                        option.displayName
                                    }
                                    value={currentValue}
                                    onChange={(e, data) => {
                                        let contactValidation = validateContact(parsePerson(interactedContact, index), ValidationReason.SAVE_CONTACT)
                                        const missingFieldsText = contactValidation?.valid ? '' : removeUnusePartOfError(contactValidation.error);
                                        changeContactStatus(
                                            interactedContact.id,
                                            e,
                                            data,
                                            props.onChange,
                                            missingFieldsText
                                        )
                                    }
                                    }
                                   
                                    inputValue={currentValue.displayName}
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
    interactedContact: GroupedInteractedContact;
    index: number;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact, index: number) => InteractedContact;
    isViewMode?: boolean;
}