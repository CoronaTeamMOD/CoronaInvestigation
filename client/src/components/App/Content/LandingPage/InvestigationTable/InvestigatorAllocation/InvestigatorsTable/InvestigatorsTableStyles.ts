import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    tableRow: {
        '&$selected, &$selected:hover': {
          backgroundColor: 'rgb(202, 222, 234)'
        },
        cursor: 'pointer'
    },
    selected: {}
});

export default useStyles;
