import { makeStyles } from '@material-ui/styles';
import {Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>({
    dialogPaper: {
        width: '40vw',
        minHeight: '25vh',
        borderRadius: '25px',
    },
    title: {
       display: 'flex',
        alignItems: 'center'
    },
    titleText:{
        paddingRight: '1vw',
        flip: false,
    },
    content: {
        display: 'flex',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export default useStyles;