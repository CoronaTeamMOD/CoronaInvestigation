import {Theme} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    tabs: {
        display: 'flex'
    },
    labelIcon: {
        '@media screen and (max-width: 1250px)': {
            minWidth: 180
        },
        padding: '0',
        '& svg': {
            paddingLeft: '0.5vw',
            flip: false,
        },
    },
    selected: {
        color: theme.palette.primary.main,
    },
    tabIndicator: {
        width: '0.2vw'
    },
    tabsSidebar: {
        flip: false,
        paddingLeft: '1vw',
        minWidth: 130
    },
}));

export default useStyles;
