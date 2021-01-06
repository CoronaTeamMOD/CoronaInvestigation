import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles({
    dateText: {
        direction: 'rtl',
        '& .MuiIconButton-root': {
            padding: '0.2vw'
        },
        '& .MuiSvgIcon-root': {
            fontSize: 'small'
        },
        '& .MuiInputBase-input': {
            fontSize: '1vw'
        },
    },
    label: {
        width: '40vw',
        display: 'flex',
        justifyContent: 'flex-end'
    },
});