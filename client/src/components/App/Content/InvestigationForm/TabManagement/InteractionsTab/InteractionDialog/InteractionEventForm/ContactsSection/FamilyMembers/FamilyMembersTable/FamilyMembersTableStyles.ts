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
    },
    red:{
        border: '4px solid #ff8080'
    },
    orange: {
        border: '4px solid #ffbf80'
    },
    green: {
        border: '4px solid #b3ffcc'
    },
    yellow: {
        border: '4px solid #ffff99'
    },
    white: {
        border: '4px solid #ffffff'
    }
});

export default useStyles;
