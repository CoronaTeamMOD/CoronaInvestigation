import React from 'react';
import { Select, SelectProps, FormControl } from '@material-ui/core';

import useStyles from './CircleSelectStyles'

const CircleSelect: React.FC<Props> = (props: Props): JSX.Element => {
    const classes = useStyles({});
    const {options, ...rest} = props;

    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <Select
                native
                {...rest}
                className={classes.selectBorder}
                classes={{ root: classes.unsetSelectColor }}
            >
                {
                    options.map((option, index) => {
                        return <option value={index}>{option}</option>
                    })
                }
            </Select>
        </FormControl>
    );  
};

export default CircleSelect;

interface Props extends SelectProps {
    options: string[];
};
