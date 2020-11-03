import React from 'react';
import { useLocation } from 'react-router-dom';
import { Home, SupervisorAccount } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography, Tooltip } from '@material-ui/core';

import UserType from 'models/enums/UserType';
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';
import { landingPageRoute, usersManagementRoute } from 'Utils/Routes/Routes';

import useAppToolbar from './useAppToolbar';

const toggleMessage = 'מה הסטטוס שלך?';
const navButtonsWhitelist = {
    allowedUserTypes: [UserType.ADMIN, UserType.SUPER_ADMIN],
    allowedRoutes: [landingPageRoute, usersManagementRoute]
};

const AppToolbar: React.FC = (): JSX.Element => {
    const { user, isActive, setUserActivityStatus, classes, countyDisplayName } = useAppToolbar();
    const location = useLocation();

    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <div className={classes.rightSection}>
            <img alt="logo" src="./assets/img/logo.png" width={48} height={48}/>
            <Typography variant="h4">אבן יסוד</Typography>
              {
                navButtonsWhitelist.allowedUserTypes.includes(user.userType) &&
                  navButtonsWhitelist.allowedRoutes.includes(location.pathname) && 
                    <div className={classes.navButtons}>
                      <NavLink  activeClassName={classes.activeItem} className={classes.menuItem} exact to={landingPageRoute}>     
                          <Home className={classes.menuIcon} />
                          <Typography className={classes.menuTypo}> עמוד הבית</Typography>       
                      </NavLink>
                      <NavLink  activeClassName={classes.activeItem}  className={classes.menuItem} exact to={usersManagementRoute}>
                        <SupervisorAccount className={classes.menuIcon} /> 
                        <Typography className={classes.menuTypo}> ניהול משתמשים</Typography> 
                      </NavLink>
                    </div>
              }
          </div>
          <div className={classes.userSection}>
            {isActive !== null &&
              <Tooltip title={toggleMessage} arrow>
                <IsActiveToggle
                  value={isActive}
                  setUserActivityStatus={setUserActivityStatus}
                  exclusive
                />
              </Tooltip>
           }
            <Typography className={classes.greetUserText}>
              שלום, {user.userName}
            </Typography>
            {countyDisplayName && 
              <Typography>
                הינך מחובר/ת ללשכת <b>{countyDisplayName}</b>
              </Typography>
            }
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default AppToolbar;
