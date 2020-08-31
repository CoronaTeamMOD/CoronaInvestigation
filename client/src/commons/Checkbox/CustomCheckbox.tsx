import React from 'react';
import { FormControlLabel, Checkbox, CheckboxProps } from '@material-ui/core';

const CustomCheckbox: React.FC<Props> = (props: Props): JSX.Element => {

    const { isChecked, handleCheck, text, ...rest } = props;

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={isChecked}
                    onChange={handleCheck}
                    size='small'
                    name='checked'
                    color='primary'
                    {...rest}
                />
            }
            label={text}
        />
    );
};

export default CustomCheckbox;

interface Props extends CheckboxProps {
    isChecked: boolean;
    text: string;
    handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
