import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
    searchBar: {
        height: '5vh',
        margin: '1vh',
        width: '22vw',
        backgroundColor: 'white',
        borderRadius: '20px'
    },
    searchBarIcons: {
        marginRight: '-1vw'
    }
}));

export default useStyles;
