import React from 'react';

import AlphabetWithDashTextField from 'commons/AlphabetWithDashTextField/AlphabetWithDashTextField';

import InternationalCityTextFieldType from './InternationalCityTextFieldTypes';

const InternationalCityTextField: InternationalCityTextFieldType = (props) => {
  return (
    <AlphabetWithDashTextField
        {...props}
        value={props.value || ''}
    />
  );
};

export default InternationalCityTextField;