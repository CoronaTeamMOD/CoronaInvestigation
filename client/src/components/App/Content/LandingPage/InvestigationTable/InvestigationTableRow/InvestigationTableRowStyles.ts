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
    completedStatusRow: {
        backgroundColor:'rgba(189, 189, 189, .1);',
    },
    tableCellRoot: {
        padding: '0',
        maxWidth: '50px'
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
    },
    botActive:{
        color:'#2C97B9',
        fontWeight:'bold'
    },
    botInactive:{
        color:'#424242',
    },
    multipleCheckSection :{
        display:'flex'
    }
}));

export default useStyles;
