import React from 'react';

import {passportSchema , idSchema} from 'Utils/Schemas/identification';
import TypePreventiveTextField from './TypingPreventionTextField';

const IdentificationTextField = (props : Props) => {
  const { isPassport } = props;

  const schema = isPassport 
    ? passportSchema
    : idSchema;  
  return (
    <TypePreventiveTextField
        {...props}
        error={'e'}
        value={props.value || ''}
        validationSchema={schema}
    />
  );
};

interface Props{
    disabled?: boolean,
    testId?: string,
    name: string,
    value: string | null,
    onChange: (value: string) => void,
    onBlur?: (event: React.ChangeEvent<{}>) => void,
    placeholder?: string,
    label?: string,
    className?: string,
    isPassport: boolean
}


export default IdentificationTextField;