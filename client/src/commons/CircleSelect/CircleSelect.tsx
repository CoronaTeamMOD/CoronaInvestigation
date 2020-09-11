import React from 'react';
import {Select, SelectProps, MenuItem} from '@material-ui/core';

import useStyles from './CircleSelectStyles'

const CircleSelect = (props: Props): JSX.Element => {
    const classes = useStyles({});
    const {options, isNameUnique = true, idKey = 'id', nameKey = 'name', ...rest} = props;
    const optionComponent = (id: any, name?: string)  => <MenuItem key={id} value={id}>{name || id}</MenuItem>
    const mapComponentFunction = (selectItem: any) => {
        return (isNameUnique)
            ? optionComponent(selectItem)
            : optionComponent(selectItem[idKey],selectItem[nameKey])
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
    options: any[];
    isNameUnique?: boolean;
    idKey?: string;
    nameKey?: string;
};
