import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    completed: {
        color: theme.palette.success.dark
    },
    icon: {
        padding : 0
    },
    popover: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
        whiteSpace: 'normal',
        padding: theme.spacing(1)
    }
}));

export default useStyles;