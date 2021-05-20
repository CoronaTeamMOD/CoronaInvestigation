import { AdminAction } from 'models/AdminAction';

const adminActions: AdminAction[] = [
        {
            id: 0, 
            displayName: 'פעולות אדמין לבחירה:'
        },
        {
            id: 1, 
            displayName: 'הוספה לבסיס הנתונים'
        }, 
        {
            id: 2, 
            displayName: 'הודעת אדמין'
        }
    ]

export const defaultAdminAction = adminActions[0];

export default adminActions;