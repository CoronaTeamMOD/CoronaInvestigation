import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    contactDialog: {
        width: '55vw',
        height: '75vh',
    },
    dialogHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#2c98b9',
    },
    headerTitle: {
        color: 'white',
        marginTop: '1vh',
        marginLeft: '1vw',
    },
    mainExposureDetails: {
        marginTop: '2vh',
        height: '44vh',
    },
    locationSelection: {
        display: 'flex',
        flexDirection: 'row',
    },
    locationPicker: {
        width: '13vw',
        height: '4vh',
    },
    newContactedPersonFields: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: ''
    },
    singleContactField: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: '2vh',
    },
    fieldLabel: {
      marginRight: '1vw',
    },
    contactCreationActions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: '',
    },
    formDivider: {
        marginTop: '2vh',
        marginBottom: '2vh',
    },
    newContactFields: {
        marginTop: '-1.75vh',
    }
});

export default useStyles;