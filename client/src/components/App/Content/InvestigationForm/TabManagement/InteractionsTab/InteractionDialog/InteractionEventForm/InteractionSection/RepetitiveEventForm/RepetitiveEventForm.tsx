import React from 'react';
import { isSameDay} from 'date-fns';
import {Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControlLabel} from '@material-ui/core';
import {ArrowDropDown, ArrowDropUp, ExpandMore} from '@material-ui/icons';
import InteractionDetailsFields from '../InteractionDetailsFields/InteractionDetailsFields';
import DetailsFieldsTitle from '../InteractionDetailsFields/DetailsFieldsTitle';
import useStyles from './RepetitiveEventFormStyles';

const MAX_DAYS_TO_DISPLAY = 7;
const EDGE_DAYS_TO_DISPLAY = (MAX_DAYS_TO_DISPLAY - 1) / 2;

const firstPossibleIndex = 0;
const RepetitiveEventForm = ({datesToOffer, selectedDateIndex}: Props) => {
    const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
    const [firstDayToDisplay, setFirstDayToDisplay] = React.useState<number>(0);
    const [lastDayToDisplay, setLastDayToDisplay] = React.useState<number>(0);
    const classes = useStyles();

    const lastPossibleIndex = React.useMemo(() => datesToOffer.length - 1, [datesToOffer]);

    const getNextFutureIndex = (prevLastIndex: number) => {
        return Math.min(lastPossibleIndex,prevLastIndex + EDGE_DAYS_TO_DISPLAY)
    };

    const getNextPastIndex = (prevFirstIndex: number) => {
        return Math.max(firstPossibleIndex, prevFirstIndex - EDGE_DAYS_TO_DISPLAY)
    };

    React.useEffect(() => {
        if (selectedDates.length === 0) {
            setSelectedDates([datesToOffer[selectedDateIndex]]);
            setFirstDayToDisplay(getNextPastIndex(selectedDateIndex));
            setLastDayToDisplay(getNextFutureIndex(selectedDateIndex))
        }
    }, [selectedDateIndex]);

    const loadNextDays = () => {
        setLastDayToDisplay(getNextFutureIndex)
    };

    const loadPreviousDays = () => {
        setFirstDayToDisplay(getNextPastIndex)
    };

    const onDateCheckClick = (date: Date, isChecked: boolean) => {
        isChecked
            ? setSelectedDates(prevDates => prevDates.concat(date))
            : setSelectedDates(prevDates => prevDates.filter(selectedDay => !isSameDay(selectedDay, date)))
    };

    const isDateSelected = (date: Date) => selectedDates.some(selectedDay => isSameDay(selectedDay, date));

    const DateCheckbox = ({day}: { day: Date }) => (
        <Checkbox color='primary'
                  checked={isDateSelected(day)}
                  onChange={(event, checked) => onDateCheckClick(day, checked)}/>
    );

    const DateTitle = ({day}: { day: Date }) => (
        <FormControlLabel
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={<DateCheckbox day={day}/>}
            label={<DetailsFieldsTitle date={day}/>}
        />
    );

    return (
        <>
            {
                firstDayToDisplay > firstPossibleIndex &&
                <Button variant='text' startIcon={<ArrowDropUp/>} onClick={loadPreviousDays}>
                    לימים קודמים נוספים
                </Button>
            }
            {
                datesToOffer.slice(firstDayToDisplay, lastDayToDisplay + 1).map(day =>
                    isDateSelected(day)
                        ? <Accordion elevation={0} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore/>}
                                              className={classes.formSectionTitle}>
                                <DateTitle day={day}/>
                            </AccordionSummary>
                            <AccordionDetails classes={{root: classes.formSection}}>
                                <InteractionDetailsFields/>
                            </AccordionDetails>
                        </Accordion>
                        : <div className='.MuiAccordion-root .MuiAccordionSummary-root'>
                            <DateTitle day={day}/>
                        </div>
                )
            }
            {
                lastDayToDisplay < lastPossibleIndex &&
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