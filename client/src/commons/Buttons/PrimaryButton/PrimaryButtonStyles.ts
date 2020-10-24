import { makeStyles } from '@material-ui/styles';

const useStyles = (background?:string) => makeStyles({
    button: {
        color: 'white',
        borderRadius: '10vw',
        height: '4vh',
        ...(background) && {background},
    },
    regular: {
        minWidth: '9vw',
    },
});

export default useStyles;
