import React from 'react';
import {KeyboardDatePicker, KeyboardDatePickerProps} from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';

import { useStyles } from './DatePickStyles';

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles({});

  const { labelText, useBigCalender,testId,error, ...restOfProps } = props;

  return (
    <KeyboardDatePicker
      error={error}
      test-id={testId}
      autoOk
      className={classes.dateText}
      disableToolbar={useBigCalender !== undefined ? useBigCalender : true}
      variant='inline'
      format='dd/MM/yyyy'
      placeholder='dd/MM/yyyy'
      margin='normal'
      label={labelText}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      InputLabelProps={{
        shrink: true,
      }}
      {...restOfProps}
    />
  );
};

export default DatePick;

interface Props extends KeyboardDatePickerProps {
  labelText?: string;
  useBigCalender?: boolean;
  maxDate?: Date,
  value: ParsableDate;
  onChange: React.EventHandler<any>;
  testId?: string;
  onBlur?: React.EventHandler<any>;
  error?: boolean;
}
