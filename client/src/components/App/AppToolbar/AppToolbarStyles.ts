import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
    logoTitle: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1
    },
    userSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetUserText: {
        marginLeft: theme.spacing(2),
        flip: false
    },
    swalTitle: {
        fontSize: '1.5vw',
        fontFamily: 'Assistant',
    }
}));

export default useStyles;
