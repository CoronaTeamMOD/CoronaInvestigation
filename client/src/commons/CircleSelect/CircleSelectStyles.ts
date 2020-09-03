import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    selectBorder: {
        borderRadius: '25px',
        height: '35px',
        fontSize: '15px',
        margin: theme.spacing(1),
        minWidth: '12vw',
    },
    unsetSelectColor: {
        backgroundColor: 'unset !important'
    },
}));

export default useStyles;
