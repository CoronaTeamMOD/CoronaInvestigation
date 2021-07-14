import React, { useEffect } from 'react';
import { ExpandMore } from '@material-ui/icons';
import { FormProvider,useForm, useFormContext } from 'react-hook-form';
import {
    Accordion, AccordionDetails, AccordionSummary,
    AccordionActions, Divider, Grid, Collapse
} from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers';

import ContactStatus from 'models/ContactStatus';
import InteractedContact from 'models/InteractedContact';
import FamilyRelationship from 'models/FamilyRelationship';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

import useStyles from './ContactQuestioningStyles';
import { FormInputs } from './ContactQuestioningInterfaces';
import ContactQuestioningInfo from './ContactQuestioningInfo';
import ContactQuestioningCheck from './ContactQuestioningCheck';
import InteractedContactFields from 'models/enums/InteractedContact';
import ContactQuestioningPersonal from './ContactQuestioningPersonal';
import ContactQuestioningClinical from './ContactQuestioningClinical';

import ContactQuestioningSchema from './ContactSection/Schemas/ContactQuestioningSchema';
import StoreStateType from 'redux/storeStateType';
import { useSelector } from 'react-redux';

const InteractedContactAccordion = (props: Props) => {

  //  const { errors, watch, ...methods } = useFormContext<FormInputs>();
  
    const methods = useForm<GroupedInteractedContact>({ //FormInputs
        mode: 'all',
        resolver: yupResolver(ContactQuestioningSchema),
    });

   
    const classes = useStyles();

    const {
  interactedContact,index, contactStatuses, saveContact, parsePerson,
        isFamilyContact, familyRelationships, shouldDisable, isViewMode
    } = props;
    //const interactedContact = useSelector<StoreStateType,GroupedInteractedContact>(state=>state.interactedContacts.interactedContacts[index]);
    
   const watchCurrentStatus: number = methods.watch(InteractedContactFields.CONTACT_STATUS);

    //const formErrors = errors?.form; //&& errors?.form[index];

    const generateBackgroundColorClass = (colorCode: Number | any) => {
        switch (colorCode) {
            case '1':
                return classes.red;
            case '2':
                return classes.orange;
            case '3':
                return classes.green;
            case '4':
                return classes.yellow;
            default:
                return classes.white;
        }
    }

    const getAccordionClasses = (): string => {
        let classesList: string[] = [];
        classesList.push(classes.accordion);

        const colorCode = interactedContact.colorCode;
        classesList.push(generateBackgroundColorClass(colorCode))

        return classesList.join(' ');
    };

    useEffect(() => {
        if (watchCurrentStatus) {
            methods.trigger();
        }
    }, [watchCurrentStatus]);

    const formValues = interactedContact;

    const getAccordion =// React.useMemo(() => {
     ()=> { return (
            <FormProvider {...methods}>
            <form
            id={`form-${interactedContact.id}`} >
            {/* <div key={interactedContact.id}> */}
                <Accordion
                    className={getAccordionClasses()}
                    style={{ borderRadius: '3vw' }}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <AccordionSummary
                        test-id='contactLocation'
                        expandIcon={<ExpandMore />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                        dir='ltr'
                    >
                        <ContactQuestioningInfo
                            index={index}
                            interactedContact={interactedContact}
                            contactStatuses={contactStatuses}
                            saveContact={saveContact}
                            parsePerson={parsePerson}
                            isViewMode={isViewMode}
                        />
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container wrap='nowrap'>
                            <ContactQuestioningPersonal
                                //index={index}
                                interactedContact={interactedContact}
                                //  control={methods.control}
                                // // formValues={formValues}
                                // trigger={methods.trigger}
                                // currentFormErrors={methods.errors?.form}
                                // watch={methods.watch}
                                //contactStatus={watchCurrentStatus}
                                isViewMode={isViewMode}
                            />
                            <Divider
                                orientation='vertical'
                                variant='middle'
                                light={true}
                            />
                            <ContactQuestioningClinical
                               // watch={watch}
                                //index={index}
                                familyRelationships={
                                    familyRelationships as FamilyRelationship[]
                                }
                               interactedContact={interactedContact}
                                isFamilyContact={isFamilyContact}
                              //  control={methods.control}
                              //  formValues={formValues}
                               // formErrors={formErrors}
                              //  trigger={methods.trigger}
                               // contactStatus={watchCurrentStatus}
                                isViewMode={isViewMode}
                            />
                            <Divider
                                orientation='vertical'
                                variant='middle'
                                light={true}
                            />
                            <ContactQuestioningCheck
                                //index={index}
                                interactedContact={interactedContact}
                                // formErrors={formErrors}
                                // control={methods.control}
                                //contactStatus={watchCurrentStatus}
                                isViewMode={isViewMode}
                            />
                        </Grid>
                    </AccordionDetails>
                    <AccordionActions className={classes.accordionActions}>
                        {!isViewMode && (
                            <PrimaryButton
                                disabled={shouldDisable(watchCurrentStatus)}
                                test-id='saveContact'
                                onClick={() => {
                                    const currentParsedPerson = parsePerson(
                                       interactedContact
                                    );
                                    saveContact(currentParsedPerson);
                                }}
                            >
                                שמור מגע
                            </PrimaryButton>
                        )}
                    </AccordionActions>
                </Accordion>
            {/* </div> */}
            </form>
            </FormProvider>
        )
    }//, [interactedContact/*JSON.stringify(formValues), formErrors, contactStatuses*/]);

    return (
        getAccordion()
    );
};

export default InteractedContactAccordion;

interface Props {
    interactedContact: GroupedInteractedContact;
    index: number;
    contactStatuses: ContactStatus[];
    saveContact: (interactedContact: InteractedContact) => boolean;
    parsePerson: (person: GroupedInteractedContact) => InteractedContact;
    isFamilyContact: boolean;
    familyRelationships: FamilyRelationship[];
    shouldDisable: (status?: string | number | undefined) => boolean;
    isViewMode?: boolean;
};