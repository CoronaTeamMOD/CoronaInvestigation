import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    investigatedDateCard: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray',
        margin: '1vh 0',
        padding: '1vh 1vw'
    },
    eudcationContactsTrigger: {
        display: 'flex',
        margin: '1vh 2vw',
        textDecoration: 'underline',
        cursor: 'pointer'
    }
});

export default useStyles;
