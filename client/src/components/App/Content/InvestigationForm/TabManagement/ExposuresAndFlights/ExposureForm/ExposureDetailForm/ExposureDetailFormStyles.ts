import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
   errorMsg:{
       display:'block',
   },
   label: {
    marginBottom:'5px',
    color: '#056989',
    fontWeight:600,
    fontSize:'18px',
 },
   accordion:{
    marginTop:'15px',
    borderRadius: '2vh',
    width: '70%',
    boxShadow: '0px 1px 2px #00000063',
    border: '2px solid #B3FFCC',
   },
   exposureTitle: {
    marginBottom:'5px',
    color: '#056989',
    fontWeight:600,
    fontSize:'18px',
    marginLeft:'5px',
    textAlign:'left'
 },

});

export default useStyles;