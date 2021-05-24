import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

export const cardHeight = '35vh'; 

const useStyles = makeStyles({
  tableRow: {
    '&$selected, &$selected:hover': {
      backgroundColor: 'rgb(202, 222, 234)'
    },
    cursor: 'pointer'
  },
  icon: {},
  active: {},
  selected: {},
  activeSortIcon: {
    '&$active': {
      '&& $icon': {
        color: theme.palette.primary.dark,
        fontSize: 'x-large'
      }
    }
  },
  tableStyle: {
    height: cardHeight
  }
});

export default useStyles;