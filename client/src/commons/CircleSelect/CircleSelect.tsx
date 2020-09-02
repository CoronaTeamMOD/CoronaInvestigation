import React from 'react';
import { Select, SelectProps, FormControl } from '@material-ui/core';

import useStyles from './CircleSelectStyles'

const CircleSelect: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});
    const {options, placeholder, className, ...rest} = props;
    const classNames = [className, classes.selectBorder];

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <Select
                {...rest}
                className={classNames.join(' ')}
                classes={{ root: classes.unsetSelectColor }}
            >
                {
                    placeholder && <option key={-1} value={''} disabled>{placeholder}</option> 
                }
                {
                    options.map((option, index) => {
                        return <option key={index} value={index}>{option}</option>
                    })
                }
            </Select>
        </FormControl>
    );  
};

export default CircleSelect;

interface Props extends SelectProps {
    options: string[]
};
