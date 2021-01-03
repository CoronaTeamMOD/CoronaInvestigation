import React from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { KeyboardDatePicker, KeyboardDatePickerProps } from '@material-ui/pickers';

import { useStyles } from './DatePickStyles';

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles({});

  const { labelText, value, onChange, onBlur, error, useBigCalender, maxDate, disabled, ...rest } = props;

  return (
    <KeyboardDatePicker
      {...rest}
      disabled={disabled}
      error={error}
      test-id={props.testId}
      autoOk
      className={classes.dateText}
      maxDate={maxDate}
      disableToolbar={useBigCalender !== undefined ? useBigCalender : true}
      variant='inline'
      format='dd/MM/yyyy'
      placeholder='dd/MM/yyyy'
      margin='normal'
      label={labelText}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
      InputLabelProps={{
        shrink: true,
        className: classes.label
      }}
    />
  );
};

export default DatePick;

interface Props extends KeyboardDatePickerProps {
  labelText?: string;
  labelTextVariant?: Variant;
  useBigCalender?: boolean;
  maxDate?: Date,
  value: ParsableDate;
  onChange: React.EventHandler<any>;
  testId?: string;
  onBlur?: React.EventHandler<any>;
  error?: boolean;
}
