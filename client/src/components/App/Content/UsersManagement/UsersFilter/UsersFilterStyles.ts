import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    autoComplete: {
        width: '10vw'
    }
}));

export default useStyles;