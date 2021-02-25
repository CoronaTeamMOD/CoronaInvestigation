import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles(() => ({
    comment : {
        fontSize: '0.9rem',
        whiteSpace: 'normal',
        overflow: 'hidden',
        marginRight: 0,
        minWidth: '200px',
    },
    readMoreLink : {
        color: theme.palette.primary.main,
        textDecoration: 'underline'
    }
}));

export default useStyles;
