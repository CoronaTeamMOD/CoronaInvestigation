import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    pageInput: {
        borderRadius: '3px',
        width: '2.7vw',
        height: '3vh',
        '& .MuiOutlinedInput-input': {
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                '-webkit-appearance': 'none',
            }
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderRadius: `0px`,
            },
        },
        '& .MuiInputBase-root': {
            minHeight: '1vh',
        },
    },
    arrowButton: {
        backgroundColor: '#2C97B9',
        borderRadius: '18px',
        height: '35px',
        width: '35px',
        border: 0,
        color: 'white',
        '&:disabled': {
            backgroundColor: '#BDBDBD'
        },
        position: 'relative',
    },
    arrowIcon: {
        textAlign: 'center',
        fontSize: '30px',
        fontWeight: 800,
        position: 'absolute',
        left: '3px',
        top: '3px',
    },
    paginationRow: {
        marginLeft: '3vw',
        alignItems: 'center',
        justify: 'flex-start',
    },
    paginationLabel: {
        fontSize: '18px'
    }
}));

export default useStyles;
