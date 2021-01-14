import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    autocompleteInput: {
        paddingRight: 'unset' + '!important',
        width: '13vw',
    },
}));

export default useStyles;
