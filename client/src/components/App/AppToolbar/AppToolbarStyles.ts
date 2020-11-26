import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        color: 'white',
        backgroundColor: theme.palette.primary.dark
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
        marginRight: theme.spacing(2)
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textDecoration: 'none',
        paddingTop: theme.spacing(1)
    },
    activeItem: {
        flip: false,
        borderRadius: 20,
        background: '#5FB1CB',
        color: 'white',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(1)
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
}

export default useStyles;
