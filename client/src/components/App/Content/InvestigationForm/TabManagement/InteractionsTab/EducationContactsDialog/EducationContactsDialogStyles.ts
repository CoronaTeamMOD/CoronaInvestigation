import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        width: '77vw',
        height: '92vh',
    },
    title: {
        display: 'flex',
        backgroundColor: 'lightgray'
    },
    titleTypography: {
        display: 'flex',
        alignItems: 'center'
    },
    titleIcon: {
        margin: '0 1vw'
    },
    content: {
        height: '40vh',
        overflowY: 'auto',
    },
    footer: {
        justifyContent: 'center'
    },
    cancelButton: {
        backgroundColor: theme.palette.grey[100],
    },
}));

export default useStyles;
