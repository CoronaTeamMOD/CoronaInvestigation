import React from 'react';
import { FormControlLabel, Checkbox, CheckboxProps } from '@material-ui/core';

const CustomCheckbox: React.FC<Props> = (props: Props): JSX.Element => {

    const { checkboxElements, checkboxesClassWrapper } = props;

    return (
        <div className={checkboxesClassWrapper}>
            {
                checkboxElements.map((checkbox, index) => {
                    const { labelText, ...rest } = checkbox;
                    return <FormControlLabel
                        key={index}
                        control={
                            <Checkbox
                                test-id={props.testId}
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
    labelText: string | JSX.Element;
};

interface Props {
    checkboxElements: CheckboxElement[];
    checkboxesClassWrapper?: string;
    testId?: string;
};