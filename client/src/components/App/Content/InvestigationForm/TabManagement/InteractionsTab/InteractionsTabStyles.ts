import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    investigatedDateCard: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray',
        margin: '1vh 0',
        padding: '1vh 1vw'
    },
    exitInvestigationButton: {
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
    }, 
});

export default useStyles;