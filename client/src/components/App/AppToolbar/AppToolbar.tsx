import React from 'react';
import { AppBar, Button, Toolbar } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import { Home, SupervisorAccount } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';

import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';
import UserType from 'models/enums/UserType';
import { landingPageRoute, usersManagementRoute } from 'Utils/Routes/Routes';

import useAppToolbar from './useAppToolbar';

const toggleMessage = 'מה הסטטוס שלך?';

const AppToolbar: React.FC = (): JSX.Element => {
    const { user, isActive, setUserActivityStatus, classes, countyDisplayName } = useAppToolbar();
    const location = useLocation();

    return (
        <AppBar className={classes.appBar} position='static'>
            <Toolbar >
                <div className={classes.rightSection}>
                    <img alt='logo' src='./assets/img/logo.png' width={48} height={48} />
                    <Typography variant='h4' >אבן יסוד</Typography>
                    {
                        (user.userType === UserType.ADMIN || user.userType === UserType.SUPER_ADMIN) &&
                        (location.pathname === landingPageRoute || location.pathname === usersManagementRoute)
                        ?        
                        <div className={classes.navButtons}>
                            <Button href={landingPageRoute} size='small' color='inherit' startIcon={<Home />}>עמוד הבית</Button>
                            <Button href={usersManagementRoute} color='inherit' startIcon={<SupervisorAccount />}>ניהול משתמשים</Button>
                        </div>
                        :
                        null
                    }
                </div>
                <div className={classes.userSection}>
                    <Tooltip title={toggleMessage} arrow>
                        <IsActiveToggle value={isActive} setUserActivityStatus={setUserActivityStatus} exclusive />
                    </Tooltip>
                    <Typography className={classes.greetUserText}>שלום, {user.userName}</Typography>
                    {countyDisplayName && <Typography>הינך מחובר/ת ללשכת <b>{countyDisplayName}</b></Typography>}
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default AppToolbar;
