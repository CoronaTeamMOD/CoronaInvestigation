import React from 'react';
import { MenuItem, Select } from '@material-ui/core';

import useStyles from './SelectDropdownStyles';

const SelectDropdown: React.FC<Props> = (props: Props): JSX.Element => {

    const classes = useStyles();
    const { id, items, value, onChange } = props;

    return (
        <Select
            id={id}
            MenuProps={{
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left'
                },
                transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left'
                },
                getContentAnchorEl: null
            }}
            value={value}
            onChange={(event) => {
                onChange(event.target.value as number)
            }}
        >
            {
                items.map((item: any) => (
                    <MenuItem
                        className={classes.menuItem}
                        key={item.id}
                        value={item.id}>
                        {item.displayName}
                    </MenuItem>
                ))
            }
        </Select>
    );
};

export default SelectDropdown;

interface Props {
    items: any;
    value: any;
    onChange: any;
    id?: string;
}
