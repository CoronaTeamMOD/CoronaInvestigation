import React from 'react';
import {useSelector} from 'react-redux';
import {Toolbar} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TopToolbarStyles';
import useTopToolbar from './useTopToolbar';
import IsActiveToggle from './IsActiveToggle/IsActiveToggle';

const toggleMessage ='מה הסטטוס שלך?';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const firstUserUpdate = React.useRef(true);

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isActive, setIsActive] = React.useState<boolean>(false);

    const {getUserActivityStatus, setUserActivityStatus} = useTopToolbar({ setIsActive });

    React.useEffect( () => {
        if (firstUserUpdate.current) {
            firstUserUpdate.current = false;
        } else {
            getUserActivityStatus();
        }
    }, [user])

    return (
        <Toolbar className={classes.toolbar} >
            <div className={classes.rightToolbarSection}>
                <img alt='logo' className={classes.logo} src='./assets/img/logo.png'></img>
                <Typography variant='h4' className={classes.centering}><div className={classes.systemName}>אבן יסוד</div></Typography>
            </div>
            <div className={classes.leftToolbarSection}>
                <Tooltip title={toggleMessage} arrow>
                    <IsActiveToggle value={isActive} setUserActivityStatus={setUserActivityStatus} exclusive/>
                </Tooltip>
                <Typography>שלום, {user.userName}</Typography>
            </div>
        </Toolbar>
    )
}

export default TopToolbar;
