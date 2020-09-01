import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => createStyles({
    selectBorder: {
        borderRadius: '25px',
        height: '35px',
        fontSize: '13px'
    },
    unsetSelectColor: {
        backgroundColor: 'unset !important'
    },
    formControl: {
        minWidth: 120,
    },
}));

export default useStyles;