import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        width: '30vw',
        display: 'flex',
        justifyContent: 'space-evenly',
        margin: '1vh 0',
        alignItems: 'center',
        height: '8vh',
    },
    autocompleteInput: {
        paddingRight: 'unset' + '!important',
        padding: '1vh 0',
        width: '12vw',
        fontSize: '1vw'
    },
}));

export default useStyles;
