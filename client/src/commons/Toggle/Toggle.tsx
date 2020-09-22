import React from 'react';
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupProps } from '@material-ui/lab';

const Toggle: React.FC<Props> = (props: Props): JSX.Element => {
    const { firstOption, secondOption, value, ...rest } = props;

    return (
        <ToggleButtonGroup value={value} exclusive {...rest}>
            <ToggleButton 
                value={false}>
                {firstOption ? firstOption : 'לא'}
            </ToggleButton>
            <ToggleButton
                value={true}>
                {secondOption ? secondOption : 'כן'}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default Toggle;

interface Props extends ToggleButtonGroupProps {
    firstOption?: string;
    secondOption?: string;
};
