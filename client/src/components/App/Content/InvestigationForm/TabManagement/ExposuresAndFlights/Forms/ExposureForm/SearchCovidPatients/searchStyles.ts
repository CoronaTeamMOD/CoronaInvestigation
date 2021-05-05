import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
    buttonWrapper: {
        '& .MuiButtonBase-root': {
            height: 'auto',
            marginLeft: '15px'
        }
    }
});

export default useStyles;
