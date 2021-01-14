import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
    dateItem: {
        padding: 0,
        '& .MuiFormControl-marginNormal': {
            margin: '0 0.2vw',
        }
    },
});

export default useStyles;