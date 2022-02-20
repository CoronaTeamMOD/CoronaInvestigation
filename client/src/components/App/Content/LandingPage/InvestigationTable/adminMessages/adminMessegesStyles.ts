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
    },
    message: {
        border: '1px solid #C4C4C4',
        borderRadius: '19px',
        padding: '5px 20px',
        margin: '12px 20px'
    },
    adminMsgSection: {
        maxWidth: '30vw',
        boxShadow: 'none'
    }
});

export default useStyles;