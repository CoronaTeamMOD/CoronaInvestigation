import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  tableRow: {
    '&$selected, &$selected:hover': {
      backgroundColor: 'rgb(202, 222, 234)'
    },
    cursor: 'pointer'
  },
  activeSortIcon: {
    '&$active': {
      '&& $icon': {
        color: theme.palette.primary.dark,
        fontSize: 'x-large'
      }
    }
  },
  icon: {},
  active: {},
  selected: {},
}));

export default useStyles;