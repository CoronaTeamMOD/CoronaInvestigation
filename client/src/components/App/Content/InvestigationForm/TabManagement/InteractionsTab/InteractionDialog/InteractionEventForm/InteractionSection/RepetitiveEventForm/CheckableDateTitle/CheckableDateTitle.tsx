import React from 'react';
import {Checkbox, FormControlLabel} from '@material-ui/core';
import DetailsFieldsTitle from '../../InteractionDetailsFields/DetailsFieldsTitle';

const DateCheckbox = ({day, isDateSelected, onDateCheckClick}: Props) => (
    <Checkbox color='primary'
              checked={isDateSelected}
              onChange={(event, checked) => onDateCheckClick(day, checked)}/>
);

const CheckableDateTitle = ({day, isDateSelected, onDateCheckClick}: Props) => (
    <FormControlLabel
        onClick={(event) => event.stopPropagation()}
        onFocus={(event) => event.stopPropagation()}
        control={<DateCheckbox isDateSelected={isDateSelected} onDateCheckClick={onDateCheckClick} day={day}/>}
        label={<DetailsFieldsTitle date={day}/>}
    />
);

interface Props {
    day: Date;
    isDateSelected: boolean;
    onDateCheckClick: (day: Date, checked: boolean) => void;
}

export default CheckableDateTitle;