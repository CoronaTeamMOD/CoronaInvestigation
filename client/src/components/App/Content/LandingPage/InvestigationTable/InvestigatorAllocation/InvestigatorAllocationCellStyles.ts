import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    selectedInvestigator: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 10px'
    },
    inActiveInvestigator: {
        color: '#F95959',
        fontWeight: 'bold'
    },
    warningIcon: {
        color: theme.palette.warning.main,
        paddingLeft: theme.spacing(1),
        flip: false
    },
    editIcon: {
        paddingLeft: '0.3vw'
    }
}));

export default useStyles;
