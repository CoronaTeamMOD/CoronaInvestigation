import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    dialogPaper: {
        width: '77vw',
        height: '92vh',
    },
    dialogTitleWrapper: {
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        textAlign: 'left',
    },
    addEventButton: {
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
    },
    cancelButton: {
        borderRadius: '10vw',
        height: '4vh',
    },
    dialogFooter: {
        padding: '2vh 1vw',
        backgroundColor: 'lightgray',
    },
    spacedOutForm: {
        maxWidth: '100%',
        paddingTop: '3vh',
    },
    allDialogContent: {
      overflow: 'hidden',
    },
    fieldNameNoWrap: {
        whiteSpace: 'nowrap',
    },
    placeTypeSelect: {
        margin: '0 2vmin',
    },
    formSelect: {
        width: '9vw'
    },
    toggle: {
        marginLeft: '1vw'
    },
    newContactFieldsContainer: {
        overflowY: 'auto',
        height: '37vh',
        paddingRight: '0.5vw'
    },
    singleNewContactForm: {
        marginBottom: '2vh',
    },
    addContactFields: {
        display: 'flex',
        flexDirection: 'row',
        height: '25vh',
        paddingRight: '0.5vw',
        flexWrap: 'wrap',
        marginBottom: '1vh',
        alignItems: 'center',
    },
    newContactField: {
        width: '15vw',
        marginRight: '2vw',
    },
    moreContactDetails: {
        width: '40vw',
        margin: '1vh',
    }
});

export default useStyles;