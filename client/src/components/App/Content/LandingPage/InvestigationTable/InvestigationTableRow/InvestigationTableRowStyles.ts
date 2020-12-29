import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    groupColor: {
        height: '4.2rem',
        width: '1rem'
    },
    padCheckboxWithoutGroup: {
        marginRight: theme.spacing(6.5)
    },
    checkedRow: {
        backgroundColor: 'rgb(202, 222, 234)!important'
    },
    tableCellRoot: {
        padding: '0'
    },
    investigationRow: {
        textDecoration: 'none'
    },
    clickableInvestigationRow: {
        cursor: 'pointer'
    },
    disabled: {
        opacity: theme.palette.action.disabledOpacity,
        cursor: 'not-allowed'
    }
}));

export default useStyles;
