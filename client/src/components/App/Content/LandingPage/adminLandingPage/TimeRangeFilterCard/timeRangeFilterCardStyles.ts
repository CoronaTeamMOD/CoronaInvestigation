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
        width: '10vw',
        height: '2vw',
        '& .MuiSelect-select': {
            fontSize: '1vw'
        },
    },
    timeRangeSelectDropdown: {
        height: '20px'
    },
    timeRangeMenuItem: {
        width: '10vw',
        height: '2vw'
    }
});

export default useStyles;