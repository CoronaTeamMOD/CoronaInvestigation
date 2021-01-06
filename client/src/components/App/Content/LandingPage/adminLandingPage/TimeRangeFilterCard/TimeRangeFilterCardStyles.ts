import { makeStyles } from '@material-ui/styles';

import theme from 'styles/theme';

const useStyles = makeStyles({
    timeRangeCard: {
        width: '20vw',
        borderRadius: '1vw',
    },
    cardTitle: {
        fontSize: '0.9vw',
        marginBottom: theme.spacing(1)
    },
    timeRangeCardContent: {
        height: '36%',
    },
    dateRangeCardContent: {
        paddingTop: 0,
        paddingBottom: 0,
        width: '18vw'
    },
    collapse: {
        height: '36%',
        '& .MuiCardContent-root:last-child': {
            paddingBottom: 0,
        }
    },
    timeCardActions: {
        direction: 'ltr', 
        paddingLeft: '1vw',
        flip: false
    },
    timeRangeSelect: {
        width: '17.5vw',
        height: '2vw',
    },
    timeRangeSelectDropdown: {
        height: '20px'
    },
    timeRangeMenuItem: {
        width: '10vw',
        height: '2vw'
    },
    timeRangeError: {
        fontSize: '1vw',
    }
});

export default useStyles;