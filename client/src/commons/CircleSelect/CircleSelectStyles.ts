import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    selectBorder: {
        borderRadius: '25px',
        height: '35px',
        fontSize: '15px'
    },
    unsetSelectColor: {
        backgroundColor: 'unset !important',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

export default useStyles;
