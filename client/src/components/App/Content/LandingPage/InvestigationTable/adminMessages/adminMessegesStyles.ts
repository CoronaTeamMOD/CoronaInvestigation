import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    cardTitle: {
        margin: theme.spacing(1)
    },
    card: {
        padding: '8px',
        borderRadius: '16px',
        margin: '8px 0',
    }
});

export default useStyles;