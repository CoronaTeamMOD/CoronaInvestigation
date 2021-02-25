import React, { useState } from 'react';
import { Typography } from '@material-ui/core';

import useStyles from './commentCellStyles';

const MAX_CHARS_PER_ROWS = 31;
const MAX_ROWS = 3;
const ellipsis = '... ';
const readMoreText = 'קרא עוד';

const MAX_CHARS_BEFORE_CUT = MAX_ROWS * MAX_CHARS_PER_ROWS;

const CommentCell = (props: Props) => {
    const { comment } = props;
    const [readMore, setReadMore] = useState<boolean>(false);

    const classes = useStyles();
    const isCommentOverflowing = comment && comment.length > MAX_CHARS_BEFORE_CUT;

    const getSlicedMessage = () => {
        return (
            <span>
                {comment.slice(0 , MAX_CHARS_BEFORE_CUT - ellipsis.length - readMoreText.length) + ellipsis}
                <span className={classes.readMoreLink} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setReadMore(true)}}>{readMoreText}</span>
            </span>
        )
    }

    return (
        <>
        <Typography className={classes.comment}>
            { 
                isCommentOverflowing && !readMore
                    ? getSlicedMessage()
                    : comment 
            }
        </Typography>
        </>
    )
}


interface Props {
    comment: string;
}

export default CommentCell
