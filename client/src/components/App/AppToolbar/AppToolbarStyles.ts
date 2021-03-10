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
    }
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