import React from 'react';
import { ExitToApp, Home, SupervisorAccount } from '@material-ui/icons';
import { NavLink, NavLinkProps, useLocation, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tooltip, IconButton } from '@material-ui/core';

import UserType from 'models/enums/UserType';
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';
import { adminLandingPageRoute, landingPageRoute, usersManagementRoute, indexRoute } from 'Utils/Routes/Routes';

import useStyles from './AppToolbarStyles';
import useAppToolbar from './useAppToolbar';

const toggleMessage = 'מה הסטטוס שלך?';
const navButtonsWhitelist = {
  allowedUserTypes: [UserType.ADMIN, UserType.SUPER_ADMIN],
  allowedRoutes: [landingPageRoute, adminLandingPageRoute, usersManagementRoute]
};

const StatePersistentNavLink = (props: NavLinkProps) => {
  const classes = useStyles();
  const history = useHistory();

  const handleNavClick: NavLinkProps['onClick'] = (event) => {
    event.preventDefault(); // prevent state reset on reroute
    history.push(props.to as string, history.location.state);
  };

  return (
    <NavLink {...props} location={history.location}
      onClick={handleNavClick}
      activeClassName={classes.activeItem} className={classes.menuItem}>
      {props.children}
    </NavLink>
  )
};

const AppToolbar: React.FC = (): JSX.Element => {
  const { user, isActive, logout, setUserActivityStatus, countyDisplayName } = useAppToolbar();

  const classes = useStyles();
  const location = useLocation();

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <div className={classes.rightSection}>
          <img alt='logo' src='./assets/img/logo.png' width={48} height={48} />
          <Typography variant='h4'>אבן יסוד</Typography>
          {
            navButtonsWhitelist.allowedUserTypes.includes(user.userType) &&
            navButtonsWhitelist.allowedRoutes.includes(location.pathname) &&
            <div className={classes.navButtons}>
              <StatePersistentNavLink exact to={indexRoute}>
                <Home className={classes.menuIcon} />
                <Typography className={classes.menuTypo}> עמוד הבית</Typography>
              </StatePersistentNavLink>
              <StatePersistentNavLink exact to={usersManagementRoute}>
                <SupervisorAccount className={classes.menuIcon} />
                <Typography className={classes.menuTypo}> ניהול משתמשים</Typography>
              </StatePersistentNavLink>
            </div>
          }
        </div>
        <div className={classes.userSection}>
          {isActive !== null &&
            <Tooltip title={toggleMessage} arrow>
              <IsActiveToggle
                value={isActive}
                onToggle={setUserActivityStatus}
                exclusive
              />
            </Tooltip>
          }
          <Tooltip title='התנתקות מהמערכת' arrow>
            <IconButton color='inherit' onClick={logout}>
              <ExitToApp />
            </IconButton>
          </Tooltip>
          <Typography className={classes.greetUserText}>
            שלום, {user.userName}
          </Typography>
          {countyDisplayName &&
            <Typography>
              הינך מחובר/ת לנפת <b>{countyDisplayName}</b>
            </Typography>
          }
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default AppToolbar;
