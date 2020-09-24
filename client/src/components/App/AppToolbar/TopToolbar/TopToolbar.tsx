import React from 'react';
import {useSelector} from 'react-redux';
import {Toolbar} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab';

import User from 'models/User';
import StoreStateType from 'redux/storeStateType';

import useStyles from './TopToolbarStyles';
import useTopToolbar from './useTopToolbar';

const toggleMessage ='מה הסטטוס שלך?';

const TopToolbar: React.FC = (): JSX.Element => {
    const classes = useStyles({});
    const firstUserUpdate = React.useRef(true);

    const user = useSelector<StoreStateType, User>(state => state.user);

    const [isActive, setIsActive] = React.useState<boolean>(false);

    const {getUserActivityStatus, setUserActivityStatus} = useTopToolbar({ setIsActive });
   
    const activeButtonStyle = {
        backgroundColor: '#117243',
        color: 'white'
    }

    const notActiveButtonStyle = {
        backgroundColor: '#9e2a2b',
        color: 'white'
    }

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
                    <ToggleButtonGroup value={isActive} exclusive className={classes.isActiveToggle}>
                        <ToggleButton className={classes.toggle} 
                            style={isActive ? activeButtonStyle : {}}
                            onClick={()=> setUserActivityStatus(!isActive)}
                            value={isActive}>
                                פעיל
                        </ToggleButton>
                        <ToggleButton className={classes.toggle} 
                            style={!isActive ? notActiveButtonStyle : {}}
                            onClick={()=> setUserActivityStatus(!isActive)}
                            value={isActive}>
                                לא פעיל  
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Tooltip>
                <Typography>שלום, {user.name}</Typography>
            </div>
        </Toolbar>
    )
}

export default TopToolbar;
