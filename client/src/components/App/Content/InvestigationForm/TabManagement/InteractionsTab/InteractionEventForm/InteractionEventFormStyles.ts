import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    spacedOutForm: {
        maxWidth: '100%',
        paddingTop: '3vh',
    },
    fieldNameNoWrap: {
        whiteSpace: 'nowrap',
    },
    newContactFieldsContainer: {
        overflowY: 'auto',
        height: '37vh',
        paddingRight: '0.5vw'
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
});

export default useStyles;