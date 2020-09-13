import { Router, Request, Response } from 'express';
import axios from 'axios';
const callCenterRouter = Router();

callCenterRouter.get('/:phoneNumber/:agentId', (request: Request, response: Response) => {
    const { phoneNumber, agentId } = request.params;
    const click2dialURL = "http://10.99.83.19:5070/AceHomeWS/Services.asmx/Click2dial?PhoneNumber="
                            + phoneNumber + "&AgentID=" + agentId;

    axios.get(click2dialURL).then((Click2dialResponse) => {
        response.send(Click2dialResponse.status);
    });
})

export default callCenterRouter;