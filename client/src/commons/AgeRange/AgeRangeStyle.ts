import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
    mainRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    numberField: {
        '& .MuiOutlinedInput-input': {
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
            }
        }
    },
});

export default useStyles;