import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    appBar: {
        color: 'white',
        backgroundColor: theme.palette.primary.dark
    },
    logoTitle: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1
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
    }
}));

export interface AppToolbarClasses {
    appBar: string;
    logoTitle: string;
    userSection: string;
    greetUserText: string;
    countyTextField: string;
    swalTitle: string;
}

export default useStyles;
