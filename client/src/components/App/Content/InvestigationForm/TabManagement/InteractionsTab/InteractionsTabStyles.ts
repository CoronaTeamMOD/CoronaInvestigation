import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
    investigatedDateCard: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray',
        margin: '1vh 0',
        padding: '1vh 1vw'
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    },
    swalText: {
        fontFamily: 'Assistant',
    },
});

export default useStyles;