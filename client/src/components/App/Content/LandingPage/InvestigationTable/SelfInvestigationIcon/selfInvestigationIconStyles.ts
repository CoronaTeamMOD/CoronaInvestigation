import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    unopened: {
        
    },
    inProgress: {
        
    },
    completed: {
        color: theme.palette.success.dark
    },
    lightTooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
        whiteSpace: 'normal'
      },
    popper: {
        zIndex: 1,
    }
}));

export default useStyles;