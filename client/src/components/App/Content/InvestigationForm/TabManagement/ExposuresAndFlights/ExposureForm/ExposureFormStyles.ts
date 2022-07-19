import { makeStyles } from '@material-ui/styles';
import theme from 'styles/theme';

const useStyles = makeStyles({
    subForm: {
        padding: '3vh 1.5vw 3vw 3vh'
    },
   label: {
      marginBottom:'5px',
      color: '#056989',
      fontWeight:600,
      fontSize:'18px',
   },
   wereConfirmedExposuresDesc :{
    marginLeft:'15px',
    width:'35vw',
   },
   errorMsg:{
       display:'block',
   },
   addFlightButton: {
       color:'#FFFFFF',
       backgroundColor: theme.palette.primary.main, //'#2C97B9',
       borderRadius: '19px',
       textAlign:'center',
       marginTop:'2px',
   }

});

export default useStyles;
