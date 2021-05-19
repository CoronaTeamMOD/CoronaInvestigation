import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

const useStyles = makeStyles({
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
  orderByAvailabilityButton: {
    border: 'none',
    fontWeight: 'bold',
    color: 'rgb(74, 74, 74)',
    fontSize: '1rem',
    cursor: 'pointer',
    position: 'absolute',
    bottom: '0',
    right: '0',
    left: 'unset',
    margin: '1vh',
  },
  investigatorAllocationTopBar: {
    position: 'relative'
  }
});

export default useStyles;