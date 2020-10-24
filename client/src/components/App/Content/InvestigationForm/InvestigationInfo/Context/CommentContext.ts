import { createContext } from 'react';

interface commentContext {
    comment: string | null,
    setComment: React.Dispatch<commentContext['comment']>
}
export const initialComment = '';

const initialClinicalDetailsContext: commentContext = {
    comment: initialComment,
    setComment: () => {}
};

export const commentContext = createContext<commentContext>(initialClinicalDetailsContext);
export const CommentContextProvider = commentContext.Provider;
