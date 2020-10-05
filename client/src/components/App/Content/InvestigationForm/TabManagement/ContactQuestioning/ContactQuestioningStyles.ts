import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        padding: '1vh 1.3vw 2.5vh 1.3vw',
    },
    title: {
        paddingLeft: '2vw',
    },
    accordion: {
        margin: theme.spacing(2),
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        width: 30,
        height: 30,
        marginLeft: theme.spacing(1),
        flip: false,
    },
    text: {
        fontSize: '1.2vw',
    },
    textField: {
        width: '9.5vw',
    },
    idTextField: {
        width: '9vw',
        marginTop: '-1vh',
    },
    autocompleteTextField: {
        width: '13vw',
        marginTop: '-1vh',
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    }
}));

export default useStyles;
