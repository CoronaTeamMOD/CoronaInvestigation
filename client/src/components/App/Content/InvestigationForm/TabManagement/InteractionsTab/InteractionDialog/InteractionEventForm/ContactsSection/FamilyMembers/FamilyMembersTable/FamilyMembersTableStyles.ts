import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    cell: {
        textAlign: 'center',
    },
    checkedRow: {
        backgroundColor: 'rgb(202, 222, 234)',
    },
    disabledRow: {
        backgroundColor: 'rgb(0, 0, 0, 0.15)'
    },
    homeIcon: {
        marginBottom: '-0.8vh',
        marginLeft: '1vw',
    }
});

export default useStyles;
