import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    spacedOutForm: {
        maxWidth: '100%',
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
    contactFormItem: {
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '2px solid rgba(224,224,224,1)'
    }
});

export default useStyles;