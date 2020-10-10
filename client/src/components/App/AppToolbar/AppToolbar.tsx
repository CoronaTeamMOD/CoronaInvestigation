import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Button, TextField, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './AppToolbarStyles';
import useAppToolbar from './useAppToolbar';
import IsActiveToggle from './IsActiveToggle/IsActiveToggle';
import { KeyboardArrowDown } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

const toggleMessage = 'מה הסטטוס שלך?';

const AppToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles();
    const firstUserUpdate = React.useRef(true);

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [isDeskAutocompleteShown, setIsDeskAutocompleteShown] = React.useState<boolean>(false);

    const handleClick = () => {
        setIsDeskAutocompleteShown(true);
    };

    const handleClose = () => {
        setIsDeskAutocompleteShown(false);
    };

    const { getUserActivityStatus, setUserActivityStatus } = useAppToolbar({ setIsActive });

    React.useEffect(() => {
        if (firstUserUpdate.current) {
            firstUserUpdate.current = false;
        } else {
            getUserActivityStatus();
        }
    }, [user])

    return (
        <AppBar className={classes.appBar} position='static'>
            <Toolbar >
                <div className={classes.logoTitle}>
                    <img alt='logo' src='./assets/img/logo.png' width={48} height={48} />
                    <Typography variant='h4' >אבן יסוד</Typography>
                </div>
                <div className={classes.userSection}>
                    <Tooltip title={toggleMessage} arrow>
                        <IsActiveToggle value={isActive} setUserActivityStatus={setUserActivityStatus} exclusive />
                    </Tooltip>
                    <Typography className={classes.greetUserText}>שלום, {user.userName}</Typography>
                    <Typography>דסק:&nbsp;</Typography>
                    {
                        !isDeskAutocompleteShown ?
                            <Button
                                color='inherit'
                                aria-controls='desk-menu'
                                aria-haspopup='true'
                                onClick={handleClick}
                                endIcon={<KeyboardArrowDown />}
                            >
                                <b>באר שבוע</b>
                            </Button>
                            :
                            <Autocomplete
                                id="combo-box-demo"
                                onBlur={handleClose}
                                options={['one','tow']}
                                style={{ width: 100 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        autoFocus
                                        color='secondary'
                                        InputProps={{
                                            ...params.InputProps,
                                            className: classes.deskTextField
                                        }}
                                    />
                                )}
                            />
                    }
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default AppToolbar;
