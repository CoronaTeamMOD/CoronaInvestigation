import React from "react";
import { Variant } from "@material-ui/core/styles/createTypography";
import { StandardTextFieldProps } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import heLocale from "date-fns/locale/he";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useStyles } from "./DatePickStyles";
import { ParsableDate } from "@material-ui/pickers/constants/prop-types";

const DatePick: React.FC<Props> = (props: Props): JSX.Element => {
  const classes = useStyles({});

  const { labelText, value, onChange } = props;

  return (
    <KeyboardDatePicker
      className={classes.dateText}
      disableToolbar
      variant="inline"
      format="dd/MM/yyyy"
      placeholder="dd/MM/yyyy"
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
