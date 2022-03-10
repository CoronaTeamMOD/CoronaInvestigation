import { AdminAction } from 'models/AdminAction';

const adminActions: AdminAction[] = [
        {
            id: 0, 
            displayName: 'פעולות אדמין לבחירה:'
        }, 
        {
            id: 2, 
            displayName: 'הודעת אדמין'
        },
        {
            id: 3, 
            displayName: 'סנכרון ערים ורחובות'
        }
    ]

export const defaultAdminAction = adminActions[0];

export default adminActions;