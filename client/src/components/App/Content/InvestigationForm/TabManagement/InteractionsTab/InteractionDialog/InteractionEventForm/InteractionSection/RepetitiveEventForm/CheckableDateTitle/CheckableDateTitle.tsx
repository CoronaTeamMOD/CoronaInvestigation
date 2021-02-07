import React from 'react';
import {Checkbox, FormControlLabel} from '@material-ui/core';
import DetailsFieldsTitle from '../../InteractionDetailsFields/DetailsFieldsTitle';

const DateCheckbox = ({day, disabled, isDateSelected, onDateCheckClick}: Props) => (
    <Checkbox color='primary'
              disabled={disabled}
              checked={isDateSelected}
              onChange={(event, checked) => onDateCheckClick(day, checked)}/>
);

const CheckableDateTitle = ({disabled, day, isDateSelected, onDateCheckClick}: Props) => (
    <FormControlLabel
        onClick={(event) => event.stopPropagation()}
        onFocus={(event) => event.stopPropagation()}
        control={<DateCheckbox disabled={!!disabled} isDateSelected={isDateSelected} onDateCheckClick={onDateCheckClick} day={day}/>}
        label={<DetailsFieldsTitle date={day}/>}
    />
);

interface Props {
    day: Date;
    isDateSelected: boolean;
    disabled?: boolean;
    onDateCheckClick: (day: Date, checked: boolean) => void;
}

export default CheckableDateTitle;