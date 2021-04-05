import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '0.7vw'
    },
    chip: {
        maxWidth: '50%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    autocomplete: {
        height: '60%',

        '& .MuiInputBase-root': {
            fontSize: '0.7vw'
        }
    },
    optionCheckbox: {
        height: '0.5vh',
        fontSize: '0.7vw',
        marginLeft: theme.spacing(1),
        flip: false,
    },
}));

export default useStyles;
