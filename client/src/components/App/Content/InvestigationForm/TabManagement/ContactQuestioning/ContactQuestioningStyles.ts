import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        padding: '1.7vw',
    },
    title: {
        paddingLeft: '2vw'
    },
    accordion: {
        margin: theme.spacing(2),
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        width: 30,
        height: 30,
        marginLeft: theme.spacing(1),
        flip: false
    }
}));

export default useStyles;
