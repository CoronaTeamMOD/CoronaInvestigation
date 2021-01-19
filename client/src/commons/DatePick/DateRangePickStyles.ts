import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
    dateItem: {
        padding: 0,
        width: '16vw',
        '& .MuiFormControl-marginNormal': {
            margin: '0 0.2vw',
        }
    },
});

export default useStyles;