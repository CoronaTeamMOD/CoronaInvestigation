import React from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { StandardTextFieldProps } from '@material-ui/core';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';

import { useStyles } from './DatePickStyles';

const TimePick: React.FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles({});

  const { error, labelText, value, onChange } = props;

  return (
    <KeyboardTimePicker
      ampm={false}
      test-id={props.testId}
      error={error}
      className={classes.dateText}
      format="HH:mm"
      placeholder="HH:mm"
      margin="normal"
      label={labelText}
      value={value}
      onChange={onChange}
      KeyboardButtonProps={{
        "aria-label": "change date",
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};

export default TimePick;

interface Props extends StandardTextFieldProps {
  error?: boolean;
  labelText?: string;
  labelTextVariant?: Variant;
  value: ParsableDate;
  onChange: any;
  testId?: string;
}
