import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { startOfDay } from 'date-fns';
import Swal from 'sweetalert2';

import Interaction from 'models/Contexts/InteractionEventDialogData';
import InvestigationStatus from 'models/enums/InvestigationStatus';
import {ClinicalDetailsDataAndSet, clinicalDetailsDataContext} from 'commons/Contexts/ClinicalDetailsContext';
import theme from 'styles/theme';
import axios from 'Utils/axios'
import { timeout } from 'Utils/Timeout/Timeout';
import { landingPageRoute } from 'Utils/Routes/Routes';

import useInteractionsTab from './useInteractionsTab';
import ContactDateCard from './ContactDateCard/ContactDateCard';
import NewInteractionEventDialog from './NewInteractionEventDialog/NewInteractionEventDialog';
import EditInteractionEventDialog from './EditInteractionEventDialog/EditInteractionEventDialog';
import useStyles from '../../InvestigationFormStyles';


const InteractionsTab: React.FC<Props> = ({ id }: Props): JSX.Element => {
    
    let history = useHistory();
    const classes = useStyles({});
    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const onDateClick = (date: Date) => setNewInteractionEventDate(date);
    const onNewEventDialogClose = () => setNewInteractionEventDate(undefined);
    const onEditEventDialogClose = () => setInteractionToEdit(undefined);
    const startEditInteraction = (interaction: Interaction) => setInteractionToEdit(interaction);

    const clinicalDetailsCtxt: ClinicalDetailsDataAndSet = useContext(clinicalDetailsDataContext);
    const [newInteractionEventDate, setNewInteractionEventDate] = React.useState<Date>();
    const [interactionToEdit, setInteractionToEdit] = React.useState<Interaction>();
    const [interactionsMap, setInteractionsMap] = React.useState<Map<number, Interaction[]>>(new Map<number, Interaction[]>())
    const [interactions, setInteractions] = React.useState<Interaction[]>([]);
    const [coronaTestDate, setCoronaTestDate] = React.useState<Date | null>(null);
    const [investigationStartTime, setInvestigationStartTime] = React.useState<Date | null>(null);
    const { getDatesToInvestigate, loadInteractions, addNewInteraction, updateInteraction, 
        getCoronaTestDate, handleDeleteContactEvent } =
        useInteractionsTab({
            setInteractions: setInteractions,
            interactions: interactions
        });

    useEffect(() => {
        loadInteractions();
        getCoronaTestDate(setCoronaTestDate, setInvestigationStartTime);

    }, []);

    useEffect(() => {
        const mappedInteractionsArray = new Map<number, Interaction[]>();
        interactions.forEach(interaction => {
            const interactionStartTime : Date | undefined = interaction.startTime;
            if (interactionStartTime) {
                const interactionDate = startOfDay(interactionStartTime).getTime();
                if (mappedInteractionsArray.get(interactionDate) === undefined) {
                    mappedInteractionsArray.set(interactionDate, [interaction]);
                } else {
                    (mappedInteractionsArray.get(interactionDate) as Interaction[]).push(interaction);
                }
            }
        });
        setInteractionsMap(mappedInteractionsArray);
    }, [interactions]);

    const SaveInteraction = (e : any) => {
        e.preventDefault();
        console.log("Interaction");
        // Swal.fire({
        //     icon: 'warning',
        //     title: 'האם אתה בטוח שאתה רוצה לסיים ולשמור את החקירה?',
        //     showCancelButton: true,
        //     cancelButtonText: 'בטל',
        //     cancelButtonColor: theme.palette.error.main,
        //     confirmButtonColor: theme.palette.primary.main,
        //     confirmButtonText: 'כן, המשך',
        //     customClass: {
        //         title: classes.swalTitle
        //     }
        // }).then((result) => {
        //     if (result.value) {
        //         axios.post('/investigationInfo/updateInvestigationStatus', {
        //             epidemiologyNumber,
        //             investigationStatus: InvestigationStatus.DONE,
        //         }).then(() => {
        //             axios.post('/investigationInfo/updateInvestigationEndTime', {
        //                 investigationEndTime: new Date(),
        //                 epidemiologyNumber
        //             }).then(() => handleInvestigationFinish()).catch(() => handleInvestigationFinishFailed())
        //         }).catch(() => {
        //             handleInvestigationFinishFailed();
        //         })
        //     };
        // });
    }

    // const handleInvestigationFinish = () => {
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'החקירה הסתיימה! הנך מועבר לעמוד הנחיתה',
    //         customClass: {
    //             title: classes.swalTitle
    //         },
    //         timer: 1750,
    //         showConfirmButton: false
    //     }
    //     );
    //     timeout(1900).then(() => {
    //         history.push(landingPageRoute);
    //     });
    // };

    // const handleInvestigationFinishFailed = () => {
    //     Swal.fire({
    //         title: 'לא ניתן היה לסיים את החקירה',
    //         icon: 'error',
    //     })
    // };

    return (
        <>
            <form id={`form-${id}`} onSubmit={(e) => SaveInteraction(e)}>
                {
                    getDatesToInvestigate(clinicalDetailsCtxt.clinicalDetailsData.doesHaveSymptoms, clinicalDetailsCtxt.clinicalDetailsData.symptomsStartDate,
                        coronaTestDate, investigationStartTime).map(date =>
                        <ContactDateCard contactDate={date}
                            onEditClick={startEditInteraction}
                            onDeleteClick={handleDeleteContactEvent}
                            createNewInteractionEvent={() => onDateClick(date)}
                            interactions={interactionsMap.get(date.getTime())}
                            key={date.getTime()}
                        />
                        )
                }
                {
                    newInteractionEventDate && <NewInteractionEventDialog
                        isOpen={newInteractionEventDate !== undefined}
                        eventDate={newInteractionEventDate}
                        closeDialog={onNewEventDialogClose}
                        handleInteractionCreation={addNewInteraction}
                    />
                }
                {
                    interactionToEdit && <EditInteractionEventDialog
                        isOpen={interactionToEdit !== undefined}
                        eventToEdit={interactionToEdit}
                        closeDialog={onEditEventDialogClose}
                        updateInteraction={updateInteraction}
                    />
                }
            </form>
        </>
    )
};

interface Props {
    id: number
}

export default InteractionsTab;