import React from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';

const CustomCheckbox: React.FC<Props> = (props: Props): JSX.Element => {

    const { isChecked, handleCheck, text } = props;

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={isChecked}
                    onChange={() => handleCheck()}
                    size='small'
                    name='checked'
                    color='primary'
                />
            }
            label={text}
        />
    );
};

export default CustomCheckbox;

interface Props {
    isChecked: boolean;
    handleCheck: () => void;
    text: string;
};
