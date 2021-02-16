import React from 'react'
import { CommentContextProvider } from  'components/App/Content/InvestigationForm/InvestigationInfo/Context/CommentContext';

const MockCommentContextProvider : React.FC<Props> = (props) => {
    const { comment , setComment } = props;
    
    return (
        <CommentContextProvider value={{comment, setComment}}>
            {props.children}
        </CommentContextProvider>
    )
}

interface Props {
    comment : string;
    setComment: () => {};
}

export default MockCommentContextProvider