import React from 'react';

import AlphabetWithDashTextField from 'commons/AlphabetWithDashTextField/AlphabetWithDashTextField';

import useStyles from './AirportTextFieldStyles';
import AirportTextFieldType from './AirportTextFieldTypes';

const AirportTextField: AirportTextFieldType = (props) => {

  const classes = useStyles();

  return (
    <AlphabetWithDashTextField
        {...props}
        value={props.value || ''}
        InputLabelProps={{
          className: classes.label,
        }}
    />
  );
};

export default AirportTextField;