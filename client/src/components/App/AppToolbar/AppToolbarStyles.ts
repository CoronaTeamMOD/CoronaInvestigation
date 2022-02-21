import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        color: 'white',
        backgroundColor: theme.palette.primary.dark
    },
    title: {
        color: 'white'
    },
    rightSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1
    },
    navButtons: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: theme.spacing(2),
        flip: false
    },
    userSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetUserText: {
        marginLeft: theme.spacing(2),
        flip: false
    },
    countyTextField: {
        backgroundColor: theme.palette.background.default
    },
    menuIcon: {
        color: 'white',
        marginRight: theme.spacing(1)
    },
    menuTypo: {
        color: 'white',
        fontFamily: 'Assistant',
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textDecoration: 'none',
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    activeItem: {
        flip: false,
        borderRadius: 20,
        background: '#5FB1CB',
        color: 'white',
    },
    select: {
        color: 'white',
        '&:focus': {
            opacity: 1
        }
    },
    adminMessagesBtn: {
        color: 'white',
        border: '2px solid #FFFFFF',
        borderRadius: 20,
        padding: '0.05vw 1.2vw',
        position: 'relative',
        marginLeft: '1.5vw'
    },
    notificationIcon: {
        fontSize: '0.8vw',
        backgroundColor: '#FF6958',
        borderRadius: '50%',
        padding: '3px',
        textAlign: 'center',
        position: 'absolute',
        top: '-0.3vw',
        left: '-0.5vw'
    },
    menuPaper: {
        top: '4vw !important',
        boxShadow: '0px 1px 2px #00000063',
        borderRadius: '16px'
    },
}));

export interface AppToolbarClasses {
    appBar: string;
    rightSection: string;
    navButtons: string;
    userSection: string;
    greetUserText: string;
    countyTextField: string;
    menuIcon: string;
    menuTypo: string;
    menuItem: string;
    activeItem: string;
};

export default useStyles;