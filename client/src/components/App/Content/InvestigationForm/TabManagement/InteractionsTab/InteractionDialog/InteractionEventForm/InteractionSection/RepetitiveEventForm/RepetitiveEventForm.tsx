import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Button} from '@material-ui/core';
import {ArrowDropDown, ArrowDropUp, ExpandMore} from '@material-ui/icons';

import InteractionDetailsFields from '../InteractionDetailsFields/InteractionDetailsFields';

import useDateLoading from './useDateLoading';
import useDateSelection from './useDateSelection';

import CheckableDateTitle from './CheckableDateTitle/CheckableDateTitle';

import useStyles from './RepetitiveEventFormStyles';

const RepetitiveEventForm = ({datesToOffer, selectedDateIndex}: Props) => {
    const {
        initializeEdgeIndexes, daysToDisplay,
        hasFutureDaysToLoad, hasPastDaysToLoad,
        loadNextDays, loadPreviousDays
    } = useDateLoading(datesToOffer);

    const { selectedDates, isDateSelected, onDateCheckClick, initializeSelectedDate} = useDateSelection();

    const classes = useStyles();


    React.useEffect(() => {
        if (selectedDates.length === 0) {
            initializeSelectedDate(datesToOffer[selectedDateIndex]);
            initializeEdgeIndexes(selectedDateIndex)
        }
    }, [selectedDateIndex]);


    return (
        <>
            {
                hasPastDaysToLoad &&
                <Button variant='text' startIcon={<ArrowDropUp/>} onClick={loadPreviousDays}>
                    לימים קודמים נוספים
                </Button>
            }
            {
                daysToDisplay.map(day =>
                    isDateSelected(day)
                        ? <Accordion elevation={0} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore/>}
                                              className={classes.formSectionTitle}>
                                <CheckableDateTitle day={day} isDateSelected={true} onDateCheckClick={onDateCheckClick}/>
                            </AccordionSummary>
                            <AccordionDetails classes={{root: classes.formSection}}>
                                <InteractionDetailsFields/>
                            </AccordionDetails>
                        </Accordion>
                        : <div className='.MuiAccordion-root .MuiAccordionSummary-root'>
                            <CheckableDateTitle day={day} isDateSelected={false} onDateCheckClick={onDateCheckClick}/>
                        </div>
                )
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
    datesToOffer: Date[];
    selectedDateIndex: number;
}

export default RepetitiveEventForm;