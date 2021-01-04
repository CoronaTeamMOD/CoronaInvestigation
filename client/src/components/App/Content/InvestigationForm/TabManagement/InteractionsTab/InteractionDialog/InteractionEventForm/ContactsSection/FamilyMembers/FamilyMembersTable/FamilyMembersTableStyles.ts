import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    cell: {
        textAlign: 'center',
    },
    checkedRow: {
        backgroundColor: 'rgb(202, 222, 234)',
    },
    disabledRow: {
        backgroundColor: 'lightgray',
    },
    homeIcon: {
        marginBottom: '-0.8vh',
        marginLeft: '1vw',
    }
});

export default useStyles;
