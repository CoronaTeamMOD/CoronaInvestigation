import { makeStyles } from '@material-ui/styles';
import {Theme} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    tab: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    tabs: {
        display: 'flex'
    },
    icon: {
        '& svg': {
            paddingLeft: '0.5vw',
            flip: false,
        }
    },
    selected: {
        color: theme.palette.primary.main,
    },
    collapse: {
        '@media screen and (max-width: 1700px)': {
            width: '84%'
        },
        width: '88%'
    },
    hiddenCollapse: {
      display: 'none'
    },
    tabIndicator: {
        width: '4px'
    }
}));

export default useStyles;
