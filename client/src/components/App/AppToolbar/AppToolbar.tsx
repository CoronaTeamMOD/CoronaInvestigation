import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ExitToApp, Home, SupervisorAccount, Notifications } from '@material-ui/icons';
import { NavLink, NavLinkProps, useLocation, useHistory } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Tooltip, IconButton, Select, MenuItem, Button, Collapse, Menu, Box } from '@material-ui/core';

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
import AdminMessages from '../Content/LandingPage/InvestigationTable/adminMessages/adminMessages';

export const toggleMessage = 'מה הסטטוס שלך?';
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
        user.userName + " (" + user.authorityByAuthorityId.authorityName + ")" : user.userName;
    const [adminMessageCount, setAdminMessageCount] = useState<number | null>(null);
    const [anchorElAdminMsg, setAnchorElAdminMsg] = React.useState<null | HTMLElement>(null);
    
    const handleOpenAdminMsg = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElAdminMsg(event.currentTarget);
    };

    const handleCloseAdminMsg = () => {
        setAnchorElAdminMsg(null);
    };

    return (
        <AppBar className={classes.appBar} position='static'>
            <Toolbar>
                <div className={classes.rightSection}>
                    <StatePersistentNavLink exact to={indexRoute} >
                        <img id='logo' alt='logo' src='./assets/img/logo.png' width={48} height={48} />
                        <Typography variant='h4' className={classes.title} id='title'>אבן יסוד</Typography>
                    </StatePersistentNavLink>
                    {
                        navButtonsWhitelist.allowedUserTypes.includes(user.userType) &&
                        navButtonsWhitelist.allowedRoutes.includes(location.pathname) &&
                        <div className={classes.navButtons}>
                            <StatePersistentNavLink exact to={landingPageRoute} >
                                <Typography className={classes.menuTypo}>  ניהול חקירות</Typography>
                            </StatePersistentNavLink>
                            <StatePersistentNavLink exact to={usersManagementRoute}>
                                <Typography className={classes.menuTypo}> ניהול משתמשים</Typography>
                            </StatePersistentNavLink>
                        </div>
                    }
                </div>
                <div className={classes.userSection}>
                    {user.isDeveloper &&
                        <Select
                            className={classes.select}
                            value={user.userType}
                            onChange={(event) => setDisplayedUserType(event.target.value as number)}
                            classes={{ icon: classes.select }}
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
                                <Typography>משתמש <b>{userTypes.find(userType => userType.id === value)?.displayName}</b></Typography>
                            }
                        >
                            {
                                userTypes.map(userType =>
                                    <MenuItem key={userType.id} value={userType.id}>
                                        {userType.displayName}
                                    </MenuItem>
                                )
                            }
                        </Select>
                    }
                    {isActive !== null &&
                        <Tooltip title={toggleMessage} arrow>
                            <IsActiveToggle
                                value={isActive}
                                onToggle={setUserActivityStatus}
                                exclusive
                            />
                        </Tooltip>
                    }
                    <Tooltip title='התנתקות מהמערכת' arrow >
                        <span id='logout-tooltip'> {/* The span role is to wrap the button to make sure the tooltip work properly even if the button is disabled */}
                            <IconButton color='inherit' onClick={logout} id='logout-button'>
                                <ExitToApp />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Typography className={classes.greetUserText} id='welcome-message'>
                        שלום, {userName}
                    </Typography>
                    {user.userType === UserTypeCodes.SUPER_ADMIN && user.isDeveloper &&
                        <Select
                            className={classes.select}
                            value={displayedDistrict}
                            onChange={(event) => changeUserDistrict(event.target.value as number)}
                            classes={{ icon: classes.select }}
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
                                <Typography>מחוז <b>{districts.find(district => district.id === value)?.displayName}</b></Typography>
                            }
                        >
                            {
                                districts.map(district =>
                                    <MenuItem key={district.id} value={district.id}>
                                        {`מחוז  ${district.displayName}`}
                                    </MenuItem>
                                )
                            }
                        </Select>
                    }
                    {user.userType === UserTypeCodes.SUPER_ADMIN ?
                        <Select
                            className={classes.select}
                            value={displayedCounty}
                            onChange={(event) => changeUserCounty(event.target.value as number)}
                            classes={{ icon: classes.select }}
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
                        : countyDisplayName &&
                        <Typography>
                            הינך מחובר/ת לנפת <b>{countyDisplayName}</b>
                        </Typography>
                    }
                    <Box>
                        {adminMessageCount != 0 &&
                            <Button className={classes.adminMessagesBtn} onClick={handleOpenAdminMsg}>
                                {!anchorElAdminMsg && <Notifications className={classes.notificationIcon} />}
                                הודעות אדמין
                            </Button>
                        }
                        <Menu
                            classes={{ paper: classes.menuPaper }}
                            anchorEl={anchorElAdminMsg}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElAdminMsg)}
                            onClose={handleCloseAdminMsg}
                        >
                            <Collapse in={anchorElAdminMsg != null}>
                                <AdminMessages
                                    deskFilter={[]}
                                    setAdminMessageCount={setAdminMessageCount} />
                            </Collapse>
                        </Menu>
                    </Box>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;