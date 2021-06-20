import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    form: {
        padding: '1vh 1.3vw 2.5vh 1.3vw',
    },
    title: {
        paddingLeft: '2vw',
    },
    accordionContainer: {
        padding : '2vw'
    },
    accordion: {
        margin: theme.spacing(2),
        padding: theme.spacing(1)
    },
    accordionActions: {
        justifyContent: 'flex-start',
        padding: '0 1vw'
    },
    errorAccordion: {
        border: `2px solid ${theme.palette.error.light}`,
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        width: 30,
        height: 30,
        marginLeft: theme.spacing(1),
        flip: false,
    },
    text: {
        fontSize: '1.2vw',
    },
    textField: {
        width: '9.5vw',
    },
    addressTextField: {
        width: '14vw',
        paddingBottom: '1vh',
    },
    extraInfo: {
        direction: 'rtl',
        flip: false,
    },
    menuItem: {
        minHeight: '3vh',
    },
    statusAutoComplete: {
        width: '11vw',
        direction: 'rtl',
        marginTop: '1vh',
    },
    reachContact: {
        width: '17vw',
        display: 'flex',
        flexDirection: 'row',
    },
    statusAutocompleteRoot: {
        '& div': {
            paddingRight: 'unset',
        },
        '& input': {
            fontSize: '15px',
            textAlign: 'end',
        }
    },
    fieldNameWithIcon: {
        display: 'flex',
        alignItems: 'center'
    },
    eventRow: {
        fontSize: '20px',
        '& p': {
            marginRight: '15px'
        }
    },
    smallSizeText: {
        fontSize: '1rem'
    },
    contactDetail: {
        direction: 'ltr',
    },
    fieldName: {
        alignSelf: 'center'
    },
    numOfContacts: {
        fontFamily: 'Assistant',
        marginLeft: '20%'
    },
    loadMore: {
        cursor: 'pointer',
        color: 'slateblue',
        font: 'caption'
    },
    red:{
        background: '#ff8080',
    },
    orange: {
        background: '#ffbf80',
    },
    green: {
        background: '#b3ffcc',
    },
    yellow: {
        background: '#ffff99',
    },
    white: {
        backgroundColor: '#ffffff'
    },
    statusInfoBtn: {
        backgroundColor: 'gray',
        color: '#ffffff',
        cursor: 'pointer',
        border: '1px solid white',
    },
    statusInfo: {
        backgroundColor: 'gray',
        color: '#ffffff',
        // border: '2px solid white',
        height: '60px',
        padding: '4px 10px'
    }
}));

export default useStyles;