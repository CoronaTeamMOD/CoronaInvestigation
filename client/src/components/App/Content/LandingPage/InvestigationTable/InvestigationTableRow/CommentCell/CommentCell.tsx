import React from 'react';
import { Tooltip, Typography } from '@material-ui/core';

import useStyles from './commentCellStyles';

const MAX_CHARS_PER_ROWS = 44;
const MAX_ROWS = 1;
const ellipsis = '... ';

const MAX_CHARS_BEFORE_CUT = MAX_ROWS * MAX_CHARS_PER_ROWS;

const CommentCell = (props: Props) => {
    const { comment } = props;

    const classes = useStyles();
    const isCommentOverflowing = comment && comment.length > MAX_CHARS_BEFORE_CUT;

    const getSlicedMessage = () => {
        if (isCommentOverflowing) {
            return (
                <Tooltip title={comment} classes={{ tooltip: classes.lightTooltip, popper: classes.popper }}
                    PopperProps={{
                        disablePortal: true,
                        placement: 'bottom-start',
                        modifiers: {
                            offset: {
                                enabled: true,
                                offset: '20px, 0',
                            },
                        },
                    }}>
                    <span>
                        {comment.slice(0, MAX_CHARS_BEFORE_CUT - ellipsis.length ) + ellipsis}
                    </span>
                </Tooltip>
            )
        }
        return (
            comment
        )
    }
    return (
        <>
            <Typography className={classes.comment}>
                {
                    getSlicedMessage()
                }
            </Typography>
        </>
    )
}

interface Props {
    comment: string;
}

export default CommentCell
