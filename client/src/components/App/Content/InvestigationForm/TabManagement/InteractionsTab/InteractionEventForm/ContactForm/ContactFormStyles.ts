import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    fieldNameNoWrap: {
        whiteSpace: 'nowrap',
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