import {makeStyles} from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    spacedOutForm: {
        maxWidth: '100%',
        paddingTop: '3vh',
    },
    fieldNameNoWrap: {
        whiteSpace: 'nowrap',
    },
    newContactFieldsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '1vw',
        flip: false
    },
    contactedPersonContainer: {
        paddingBottom: '5vh'
    },
    contactDate: {
        '@media screen and (min-width: 1870px)': {
            marginLeft: '-3vw',
        },
        marginLeft: '3vw',
    },
    contactDatePicker: {
        '@media screen and (min-width: 1870px)': {
            marginLeft: '-3vw',
            width: '11.5vw',
        },
    },
    duplicateIdsError: {
        zIndex: 1300,
    },
    externalizationErrorMessage: {
        color: theme.palette.error.main
    }
});

export default useStyles;