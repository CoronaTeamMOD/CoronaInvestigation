import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    button: {
        display:'flex',
        alignItems: 'center'
    },
    logo: {
        width: '3vw'
    },
    hiddenFileInput: {
        width: '0.1px',
        height: '0.1px',
        opacity: 0,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: -1,
    }
}));

export default useStyles;
