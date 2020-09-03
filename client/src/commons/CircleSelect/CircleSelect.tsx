import React from 'react';
import {Select, SelectProps, MenuItem} from '@material-ui/core';

import useStyles from './CircleSelectStyles'

const CircleSelect = (props: Props): JSX.Element => {
    const classes = useStyles({});
    const {options, isNameUnique = true, idKey, valueKey, ...rest} = props;

    const optionComponent = (value: any, name?: string)  => <MenuItem key={value} value={value}>{name || value}</MenuItem>
    const mapComponentFunction = (selectItem: any) => {
        return isNameUnique ? optionComponent(selectItem) : optionComponent(selectItem[props.valueKey as string], selectItem[props.idKey as string])
    }

    return (
            <Select variant='outlined'
                {...rest}
                className={classes.selectBorder}
                classes={{ root: classes.unsetSelectColor }}
            >
                {
                    options.map(mapComponentFunction)
                }
            </Select>
    );
};

export default CircleSelect;

interface Props extends SelectProps {
    options: string[];
    isNameUnique?: boolean;
    idKey?: string;
    valueKey?: string;
};
