import { makeStyles } from '@material-ui/styles';

import { primaryBackgroundColor } from 'styles/theme';

const useStyle = makeStyles({
  '@keyframes loader': {
    '100%': {
      width: '100%'
    }
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    backgroundColor: primaryBackgroundColor,
    opacity: '0.8 !important',
  },
  wrapper: {
    width: '300px',
    height: '30px',
    background: '#2c2c2c',
    borderRadius: '30px',
    position: 'relative',
    top: '130px',
    margin: '0 auto',
    transform: 'rotate(-90Deg) scale(0.85)',
    '&::before' : {
      content: '""',
      position: 'absolute',
      background: 'inherit',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      left: '-10px',
      top: '50%',
      marginTop: '-22px'
    },
    '&::after': {
      content: '""',
      height: '100%',
      width: '10px',
      background: '#2c2c2c',
      position: 'absolute',
      left: '28px',
      top: '0',
    }
  },
  loader: {
    width: '95%',
    height: '50%',
    position: 'absolute',
    left: '0',
    top: '50%',
    marginTop: '-8px',
    background: '#404040',
    borderRadius: 'inherit',
    zIndex: 100
  },
  inner: {
    width: '0%',
    height: '100%',
    background: '#2b8095',
    animation: '$loader 5s ease-out infinite',
    borderRadius: 'inherit',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      background: '#2b8095',
      left: '-3px',
      top: '50%',
      marginTop: '-15px'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      height: '100%',
      background: '#2b8095',
      width: '20px',
      top: 0,
      left: '25px',
      zIndex: 200
    }
  }
});

export default useStyle;
