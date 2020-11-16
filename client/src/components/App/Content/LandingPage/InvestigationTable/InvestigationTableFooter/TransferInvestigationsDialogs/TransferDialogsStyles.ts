import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    dialog: {
        width: '30vw',
        borderRadius: '5vh',
        padding: '1vh 1vw',
    },
    inputRow: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '1vh 0',
    },
    input: {
        width: '15vw',
        margin: '0 1vw',
    },
    dialogActions: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        borderRadius: '1vh'
    }
}));

export default useStyles;