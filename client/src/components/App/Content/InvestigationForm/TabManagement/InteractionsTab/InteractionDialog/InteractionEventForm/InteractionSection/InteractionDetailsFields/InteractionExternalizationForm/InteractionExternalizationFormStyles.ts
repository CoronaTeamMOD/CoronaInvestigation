import { makeStyles } from '@material-ui/styles';
import {Theme} from '@material-ui/core';

const useStyles = makeStyles((theme:Theme) => ({
    externalizationErrorMessage: {
        color: theme.palette.error.main
    }
}));

export default useStyles;
