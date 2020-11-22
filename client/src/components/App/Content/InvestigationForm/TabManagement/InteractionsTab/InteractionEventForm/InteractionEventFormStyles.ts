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
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        height: '37vh',
        paddingRight: '0.5vw'
    },
    contactedPersonContainer: {
        paddingBottom: '2%'
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