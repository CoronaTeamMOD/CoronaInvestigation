import { makeStyles } from '@material-ui/styles';

import theme, { primaryBackgroundColor } from 'styles/theme';

const speed = 1.5;
const getBoucnesDealys = () => {
  const delays: any = {};
  for (let i = 1; i <= 5; i++) {
    const nthString = `&:nth-child(${i})`
    delays[nthString] = {animationDelay :  0.1*speed*(i-1) + 's'};
  }
  return delays;
} 

const useStyle = makeStyles({
  '@keyframes bounce': {
    '0%, 60%, 100%': {
      background: 'rgba(44, 151, 185,0.25)',
      transform: 'translateY(0)'
    },
    '20%': {
      background: 'rgba(44, 151, 185,0.75)',
      transform: 'translateY(13px)'
    },
    '40%': {
      background: 'rgba(44, 151, 185,0.75)',
      transform: 'translateY(-13px)'
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
  ball: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    margin: '10px',
    animation: `${speed}s $bounce infinite`,
    ...getBoucnesDealys(),
  }
});

export default useStyle;
