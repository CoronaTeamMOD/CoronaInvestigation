import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    adminActionCard: {
        borderRadius: '1vw',
    },
    cardTitle: {
        marginBottom: theme.spacing(1)
    },
});

export default useStyles;