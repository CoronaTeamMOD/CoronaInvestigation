import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    selected: {
        backgroundColor: 'rgb(202, 222, 234)'
    },
    disabled: {
        backgroundColor: 'rgb(0, 0, 0, 0.15)'
    }
}));

export default useStyles;