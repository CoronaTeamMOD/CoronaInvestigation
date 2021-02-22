import React from 'react';
import { useSelector } from 'react-redux';
import { ExitToApp, Home, SupervisorAccount } from '@material-ui/icons';
import { NavLink, NavLinkProps, useLocation, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tooltip, IconButton, Select, MenuItem } from '@material-ui/core';

import County from 'models/County';
import District from 'models/District';
import UserType from 'models/UserType';
import StoreStateType from 'redux/storeStateType';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import IsActiveToggle from 'commons/IsActiveToggle/IsActiveToggle';
import { setDisplayedCounty, setDisplayedUserType } from 'redux/User/userActionCreators';
import { adminLandingPageRoute, landingPageRoute, usersManagementRoute, indexRoute, investigationFormRoute } from 'Utils/Routes/Routes';

import useStyles from './AppToolbarStyles';
import useAppToolbar from './useAppToolbar';

const toggleMessage = 'מה הסטטוס שלך?';
const navButtonsWhitelist = {
    allowedUserTypes: [UserTypeCodes.ADMIN, UserTypeCodes.SUPER_ADMIN],
    allowedRoutes: [landingPageRoute, adminLandingPageRoute, usersManagementRoute, investigationFormRoute]
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
            activeClassName={classes.activeItem} className={classes.menuItem}
        >
            {props.children}
        </NavLink>
    );
};

const AppToolbar: React.FC = (): JSX.Element => {
    const { user, isActive, logout, setUserActivityStatus, changeUserDistrict, changeUserCounty } = useAppToolbar();

    const userTypes = useSelector<StoreStateType, UserType[]>(state => state.user.userTypes);
    const displayedDistrict = useSelector<StoreStateType, number>(state => state.user.displayedDistrict);
    const districts = useSelector<StoreStateType, District[]>(state => state.district);
    const displayedCounty = useSelector<StoreStateType, number>(state => state.user.displayedCounty);
    const districtCounties = useSelector<StoreStateType, County[]>(state => state.county.districtCounties);
    const countyDisplayName = useSelector<StoreStateType, string>(state => state.user.data.countyByInvestigationGroup.displayName);
    
  

    const classes = useStyles();
    const location = useLocation();
    const userName = user.authorityByAuthorityId?.authorityName ? 
                          user.userName +" (" + user.authorityByAuthorityId.authorityName + ")"  : user.userName;

  return (
    <AppBar className={classes.appBar} position='static'>
      <Toolbar>
        <div className={classes.rightSection}>
          <img id='logo' alt='logo' src='./assets/img/logo.png' width={48} height={48} />
          <Typography variant='h4' id='title'>אבן יסוד</Typography>
          {
            navButtonsWhitelist.allowedUserTypes.includes(user.userType) &&
            navButtonsWhitelist.allowedRoutes.includes(location.pathname) &&
            <div className={classes.navButtons}>
              <StatePersistentNavLink exact to={indexRoute} 
                isActive={(match, location) => 
                  (location.pathname === adminLandingPageRoute || location.pathname  === landingPageRoute)}>
                <Home className={classes.menuIcon} />
                <Typography className={classes.menuTypo}> עמוד הבית</Typography>
              </StatePersistentNavLink>
              <StatePersistentNavLink exact to={usersManagementRoute}>
                <SupervisorAccount className={classes.menuIcon} />
                <Typography className={classes.menuTypo}> ניהול משתמשים</Typography>
              </StatePersistentNavLink>
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
                שלום, {userName}
            </Typography>
            {
                user.userType === UserType.SUPER_ADMIN ?
                <Select
                    className={classes.countySelect}
                    value={displayedCounty}
                    onChange={(event) => setDisplayedCounty(event.target.value as number)}
                    classes={{icon: classes.countySelect}}
                    disableUnderline
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
                    renderValue={(value) => 
                    <Typography>נפת <b>{districtCounties.find(county => county.id === value)?.displayName}</b></Typography>
                    }
                >
                    {
                    districtCounties.map(county => 
                        <MenuItem key={county.id} value={county.id}>
                            {`נפת  ${county.displayName}`}
                        </MenuItem>
                    )
                    }
                </Select>
                :
                countyDisplayName &&
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