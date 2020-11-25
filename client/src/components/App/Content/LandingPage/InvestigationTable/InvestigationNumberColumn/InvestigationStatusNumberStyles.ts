import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    columnWrapper: {
        display: 'flex'
    },
    transferredIcon: {
        margin: '0.2vh 0.5vw',
        cursor: 'pointer',
    },
    marginNonTransffered: {
        flip: false,
        marginRight: '2.4vw'
    }
}));

export default useStyles;
