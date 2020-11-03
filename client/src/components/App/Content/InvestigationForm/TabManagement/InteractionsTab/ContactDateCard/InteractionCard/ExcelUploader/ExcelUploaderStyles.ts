import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    uploadButton: {
        display:'flex',
        alignItems: 'center',
        width: 'auto'
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
