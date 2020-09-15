import React from 'react';
import {Select, SelectProps, MenuItem, FormControl, InputLabel} from '@material-ui/core';

import useStyles from './CircleSelectStyles'

const CircleSelect = (props: Props): JSX.Element => {
    const classes = useStyles({});
    const {required, options, isNameUnique = true, idKey = 'id', nameKey = 'name', ...rest} = props;
    const optionComponent = (id: any, name?: string)  => <MenuItem key={id} value={id}>{name || id}</MenuItem>
    const mapComponentFunction = (selectItem: any) => {
        return (isNameUnique)
            ? optionComponent(selectItem)
            : optionComponent(selectItem[idKey],selectItem[nameKey])
    }

    return (
        <FormControl required={required}>
                {required &&
                <InputLabel className={classes.label} shrink>
                    שדה חובה    
                </InputLabel>}
                <Select variant='outlined'
                    {...rest}
                    label={required && "__*שדה חובה"}
                    className={classes.selectBorder}
                    classes={{ root: classes.unsetSelectColor }}
                >
                    {
                        options.map(mapComponentFunction)
                    }
                </Select>
            </FormControl>
    );
};

export default CircleSelect;

interface Props extends SelectProps {
    options: any[];
    required?: boolean;
    isNameUnique?: boolean;
    idKey?: string;
    nameKey?: string;
};
