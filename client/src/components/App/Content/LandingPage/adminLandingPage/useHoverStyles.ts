import { makeStyles } from '@material-ui/styles'

import theme from 'styles/theme';

const useStyles = makeStyles({
    whiteButtons: {
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.text.primary
        }
    },
    coloredButtons: {
        '&:hover': {
            opacity: 0.75
        }
    },
});

export default useStyles;