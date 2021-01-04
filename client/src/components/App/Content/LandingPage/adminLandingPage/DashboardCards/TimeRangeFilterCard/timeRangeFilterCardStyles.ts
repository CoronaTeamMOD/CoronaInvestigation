import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    cardTitle: {
        fontSize: '0.9vw',
        marginBottom: theme.spacing(1)
    },
    timeRangeCardContent: {
        height: '36%',
    },
    timeCardActions: {
        direction: 'ltr', 
        paddingLeft: '1vw',
        flip: false
    },
    timeRangeSelect: {
        width: '10vw',
        height: '2vw'
    },
    timeRangeMenuItem: {
        width: '10vw',
        height: '2vw'
    }
});

export default useStyles;