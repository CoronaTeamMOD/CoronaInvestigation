import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    buttonWrapper: {
        '& .MuiButtonBase-root': {
            height: 'auto'
        }
    },
    andConnectorWrapper: {
        padding: '0 12px'
    }
});

export default useStyles;
