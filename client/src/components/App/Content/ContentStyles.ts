import { makeStyles } from '@material-ui/styles'

import theme from '../../../styles/theme';

const useStyles = makeStyles({
    content: {
        backgroundColor: 'lightGrey',
        padding: '0.7vw',
    },
    finishInvestigationButton: {
        marginTop: '1vh',
        marginLeft: '1.2vw',
        backgroundColor: theme.palette.primary.main,
        color: 'white'
    }
});

export default useStyles;
