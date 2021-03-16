import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    container: {
        '& .MuiFormControl-root': {
            margin: '0 10px',
            minWidth: '150px',
            maxWidth: '250px',
            
            '& .MuiInputLabel-root': {
                backgroundColor: 'white'
            }
        }
    }
});

export default useStyles;
