import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles(() => ({
    comment : {
        overflowWrap: 'break-word',
        fontSize: '0.9rem',
        whiteSpace: 'normal',
        overflow: 'hidden',
        marginRight: 0,
        minWidth: '200px',
    },
    readMoreLink : {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        marginLeft: '0.25rem'
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
