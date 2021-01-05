import React from 'react';

import AlphabetWithDashTextField from 'commons/AlphabetWithDashTextField/AlphabetWithDashTextField';

import useStyles from './AirelineTextFieldStyles';
import AirelineTextFieldType from './AirelineTextFieldTypes';

const AirelineTextField: AirelineTextFieldType = (props) => {

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

export default AirelineTextField;