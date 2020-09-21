<<<<<<< HEAD
import React from 'react';
import { Variant } from '@material-ui/core/styles/createTypography';
import { StandardTextFieldProps } from '@material-ui/core';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { useStyles } from './DatePickStyles';

const TimePick: React.FC<Props> = (props: Props): JSX.Element => {
=======
import React from "react";
import { Variant } from "@material-ui/core/styles/createTypography";
import { StandardTextFieldProps } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import heLocale from "date-fns/locale/he";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import { ParsableDate } from "@material-ui/pickers/constants/prop-types";
import { useStyles } from "./DatePickStyles";

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
>>>>>>> 8544bf5b932b70f66a61bee5b0741f4c7889d109
  const classes = useStyles({});

  const { labelText, value, onChange } = props;

  return (
    <KeyboardTimePicker
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

<<<<<<< HEAD
export default TimePick;
=======
export default DatePick;
>>>>>>> 8544bf5b932b70f66a61bee5b0741f4c7889d109

interface Props extends StandardTextFieldProps {
  labelText?: string;
  labelTextVariant?: Variant;
  value: ParsableDate;
  onChange: any;
}
