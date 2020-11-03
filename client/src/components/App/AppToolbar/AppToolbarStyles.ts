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
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    menuIcon: {
        color: 'white',
        marginRight: theme.spacing(1)
    },
    menuTypo: {
        color: 'white',
        fontStyle: '',
        fontFamily: 'Assistant',
        marginRight: theme.spacing(2)
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textDecoration: 'none'
    },
    activeItem: {
        textDecoration: 'underline',
        textDecorationColor: 'white'
    }
}));

export interface AppToolbarClasses {
    appBar: string;
    rightSection: string;
    navButtons: string;
    userSection: string;
    greetUserText: string;
    countyTextField: string;
    swalTitle: string;
    menuIcon: string;
    menuTypo: string;
    menuItem: string;
    activeItem: string;
}

export default useStyles;
