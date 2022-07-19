import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
   errorMsg:{
       display:'block',
   },
   accordion:{
    marginTop:'15px',
    borderRadius: '2vh',
    width: '70%',
    boxShadow: '0px 1px 2px #00000063',
    border: '2px solid #B3FFCC',
   },
   flightTitle: {
    marginBottom:'5px',
    color: '#056989',
    fontWeight:600,
    fontSize:'18px',
    marginLeft:'5px',
    textAlign:'left'
 },
 airportTextbox: {
    width: '100%',
}
});

export default useStyles;