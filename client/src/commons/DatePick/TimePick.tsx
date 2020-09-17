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

export default DatePick;

interface Props extends StandardTextFieldProps {
  labelText?: string;
  labelTextVariant?: Variant;
  value: ParsableDate;
  onChange: any;
}
