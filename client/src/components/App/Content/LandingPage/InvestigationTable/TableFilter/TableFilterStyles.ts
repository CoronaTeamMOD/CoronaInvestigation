
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        alignItems: 'center',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: 16,
        maxHeight: '80%',
        justifyContent: 'space-between',
        paddingBottom: 0 ,       
    },
    mainLine: {
        display: 'flex',
        alignItems: 'center',
        maxHeight: '80%',
        gap:'10px',
        marginBottom:'10px',
        flexWrap:'wrap'
    },
    ageRange:{
        display:'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap:'nowrap',
    },
    botLine: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 16,
        maxHeight: '80%'
    },
    counterLabel: {
        fontWeight: 600
    },
    tableHeaderRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        display: 'flex',
    },
    startCard: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: theme.spacing(1)
    },
    endCard: {
        display: 'flex',
        alignItems: 'center',
        justifyItems:'center'
    },
    row: {
        flexDirection: 'row',
    },
    autocompleteInput: {
        paddingRight: 'unset'
    },
    autocompleteInputText: {
        width: 'unset'
    },
    checkbox: {
        padding: '2px'
    },
    optionCheckbox: {
        height: '0.5vh',
        marginLeft: theme.spacing(1),
        flip: false
    },
    headTitle: {
        fontSize: '1.2vw',
        paddingRight: '1vw'
    },
    title: {
        fontSize: '1vw',
        padding: '0 0.4vw',
        display: 'inline'
    },
    formControl: {
        padding: '0 0.4vw'
    },
    formControlCustomTimeRange: {
        padding: '0 0.4vw',
        margin: '43px 0 10px 0'
    },
    option: {
        fontSize: '1vw',
    },
    chip: {
        maxWidth: '71%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    timeRangeError: {
        fontSize: '15px',
        color: 'red',
    },
    column: {
        flexDirection: 'column'
    },
    filterTitle: {
        color: theme.palette.primary.main,
        fontWeight: 600,
        paddingRight: '5vw',
        fontSize: '20px'
    },
    filterSubTitle: {
        color:'black',
        fontSize:'18px',
        fontWeight:400
    },
    selectDropdown: {
        width:'100%',
    },
    collapse : {
        width:'100%',
    },
    filterButton: {
        backgroundColor: '#5FB1CB',
        color: 'black',
        borderRadius: '10vw',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
        },
        marginRight:'15px',
        fontSize:'1vw',
    },
    filterIconButton: {
        paddingRight:'7px',
    },
    resetLinkButton: {
        marginRight:'15px',
        color:'black',
        fontSize:'1vw',
        fontFamily:'Assistant',
        textDecoration: 'underline',  
        fontWeight: 500,
    },
    expandIconButton: {
        position:'relative',
        fontSize:'20px',
        cursor:'pointer',
    },
    expandIcon: {
        position:'absolute',
        left:'3px',
        color:'white',
    }

}));

export default useStyles;
