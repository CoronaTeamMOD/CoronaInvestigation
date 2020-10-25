import React, {useContext} from 'react';
import {IconButton, Menu, MenuItem, Typography} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CommentIcon from '@material-ui/icons/CommentOutlined';

import CommentDialog from './CommentDialog/CommentDialog'
import {commentContext} from '../../Context/CommentContext';

import useStyles from './InvestigationMenuStyles';

const existingCommentColor = '#91BF7C';
const noCommentsColor = '#727272';

const InvestigationMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
    const {comment} = useContext(commentContext);

    const open = Boolean(anchorEl);
    const classes = useStyles();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);
    const handleDialogClose = () => setIsDialogOpen(false);

    const handleDialogOpen = () => {
        handleMenuClose();
        setIsDialogOpen(true)
    };

    return (
        <>
            <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon color='primary'/>
            </IconButton>
            <Menu classes={{paper: classes.menu}}
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleMenuClose}>
                <MenuItem className={classes.menuItem} onClick={handleDialogOpen}>
                    <CommentIcon htmlColor={comment ? existingCommentColor : noCommentsColor}/>
                    <Typography>
                        הערות על החקירה
                    </Typography>
                </MenuItem>
            </Menu>
            <CommentDialog open={isDialogOpen}
                           handleDialogClose={handleDialogClose}/>
        </>
    );
};

export default InvestigationMenu;