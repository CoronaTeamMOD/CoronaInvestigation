import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    columnWrapper: {
        display: 'flex'
    },
    transferredIcon: {
        fontSize: '20px',
        margin: '0.2vh 0.5vw',
        cursor: 'pointer',
        color: theme.palette.primary.main,
    },
}));

export default useStyles;
