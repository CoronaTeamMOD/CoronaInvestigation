import { makeStyles } from '@material-ui/styles'

import theme from '../../../styles/theme';

const useStyles = makeStyles({
    content: {
        backgroundColor: 'lightGrey',
        padding: '0.7vw',
    },
    buttonSection: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    finishInvestigationButton: {
        marginTop: '1vh',
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    },
});

export default useStyles;
