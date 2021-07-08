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
        color: '#ff8080',
        margin: '0 3px'
    },
    orange: {
        color: '#ffbf80',
        margin: '0 3px'
    },
    green: {
        color: '#b3ffcc',
        margin: '0 3px'
    },
    yellow: {
        color: '#ffff99',
        margin: '0 3px'
    },
    white: {
        display: 'none'
    }
});

export default useStyles;
