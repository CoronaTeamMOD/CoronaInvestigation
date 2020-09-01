import React from 'react';
import { FormControlLabel, Checkbox, CheckboxProps } from '@material-ui/core';

const CustomCheckbox: React.FC<Props> = (props: Props): JSX.Element => {

    const { checkboxElements, checkboxesClassWrapper } = props;

    return (
        <div className={checkboxesClassWrapper}>
            {
                checkboxElements.map(checkbox => {
                    const { lableText: labelText, ...rest } = checkbox;
                    return <FormControlLabel
                        key={labelText}
                        control={
                            <Checkbox
                                size='small'
                                name='checked'
                                color='primary'
                                {...rest}
                            />
                        }
                        label={labelText}
                    />
                })
            }
        </div>
    );
};

export default CustomCheckbox;

interface CheckboxElement extends CheckboxProps {
    lableText: string;
};

interface Props {
    checkboxElements: CheckboxElement[];
    checkboxesClassWrapper?: string;
};
