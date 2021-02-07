import React from 'react';
import {isSameDay} from 'date-fns';
import {Accordion, AccordionDetails, AccordionSummary, Button} from '@material-ui/core';
import {ArrowDropDown, ArrowDropUp, ExpandMore} from '@material-ui/icons';

import InteractionDetailsFields from '../InteractionDetailsFields/InteractionDetailsFields';

import useDateLoading from './hooks/useDateLoading';
import useDateSelection from './hooks/useDateSelection';

import CheckableDateTitle from './CheckableDateTitle/CheckableDateTitle';

import useStyles from './RepetitiveEventFormStyles';

const RepetitiveEventForm = ({selectedDate}: Props) => {
    const {
        initializeEdgeIndexes, daysToDisplay,
        hasFutureDaysToLoad, hasPastDaysToLoad,
        loadNextDays, loadPreviousDays
    } = useDateLoading();

    const {selectedDates, getDateIndex, onDateCheckClick} = useDateSelection();

    const classes = useStyles();

    React.useEffect(() => {
        if (selectedDates.length === 0) {
            initializeEdgeIndexes(selectedDate)
        }
    }, [selectedDate]);

    return (
        <>
            {
                hasPastDaysToLoad &&
                <Button variant='text' startIcon={<ArrowDropUp/>} onClick={loadPreviousDays}>
                    לימים קודמים נוספים
                </Button>
            }
            {
                daysToDisplay.map(day => {
                    const dateIndex = getDateIndex(day);
                    const isInitialDay = isSameDay(selectedDate, day);
                    return (dateIndex >= 0 || isInitialDay)
                        ? <Accordion key={day.getTime()} elevation={0} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore/>} className={classes.formSectionTitle}>
                                <CheckableDateTitle disabled={isInitialDay}
                                                    day={day} isDateSelected={true}
                                                    onDateCheckClick={onDateCheckClick}/>
                            </AccordionSummary>
                            <AccordionDetails classes={{root: classes.formSection}}>
                                <InteractionDetailsFields interactionDate={day}
                                                          {...!isInitialDay && {index: dateIndex}}/>
                            </AccordionDetails>
                        </Accordion>
                        : <div key={day.getTime()} className='.MuiAccordion-root .MuiAccordionSummary-root'>
                            <CheckableDateTitle day={day} isDateSelected={false} onDateCheckClick={onDateCheckClick}/>
                        </div>
                })
            }
            {
                hasFutureDaysToLoad &&
                <Button variant='text' startIcon={<ArrowDropDown/>} onClick={loadNextDays}>
                    לימים נוספים
                </Button>
            }
        </>
    );
};

interface Props {
    selectedDate: Date;
}

export default RepetitiveEventForm;