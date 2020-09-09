import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ADD_ADDRESS_AND_GET_ID } from '../../DBService/Address/Mutation'
import { CREATE_CONTACT_EVENT } from '../../DBService/ContactEvents/Mutations';
import {CreateAddressRespone} from "../../ClinicalDetails/CreateAddress";

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.post('/contactEvent/createEvent', (req: Request, res: Response) => {
    const eventAddress = req.body.address;
    const newEvent = req.body.event;
    graphqlRequest(ADD_ADDRESS_AND_GET_ID, {
        ...eventAddress
    }).then((addrResult: CreateAddressRespone) => {
        graphqlRequest(CREATE_CONTACT_EVENT, {
            contactEvent: {
                ...newEvent,
                locationAddress: addrResult.data.insertAndGetAddressId.integer,
            }
        }).then(() => {
            res.send('Created new contact event');
        })
    })
});

export default intersectionsRoute;