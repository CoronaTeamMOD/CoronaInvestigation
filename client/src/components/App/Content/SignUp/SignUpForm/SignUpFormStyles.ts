import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    formRow: {
        margin: '3vh 0',
    },
    textField: {
        width: '238px',
    }
}));

export default useStyles;
