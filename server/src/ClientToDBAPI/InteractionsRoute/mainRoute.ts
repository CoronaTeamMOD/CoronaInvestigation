import { Router, Request, Response } from 'express';
import { graphqlRequest } from '../../GraphqlHTTPRequest';
import { ADD_ADDRESS_AND_GET_ID } from '../../DBService/Address/Mutation'
import { ADD_INTERACTION_EVENT } from '../../DBService/InteractionEvents/Mutations';
import {CreateAddressRespone} from "../../ClinicalDetails/CreateAddress";

const intersectionsRoute = Router();

intersectionsRoute.get('/', (request: Request, response: Response) => {
    // TODO: add data parsing from DB
    response.send(request.query.epidemioligyNumber);
})

intersectionsRoute.post('/saveEventAndContacts', (req: Request, res: Response) => {
    const eventAddress = req.body.address;
    const newEvent = req.body.event;
    graphqlRequest(ADD_ADDRESS_AND_GET_ID, {

    }).then((addrResult: CreateAddressRespone) => {
        graphqlRequest(ADD_INTERACTION_EVENT, {
            event: {
                investigationId: newEvent.investigationId,
                allowsHamagenData: newEvent.allowsHamagenData,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                placeName: newEvent.placeName,
                placeType: newEvent.placeType,
                locationAddress: addrResult.data.insertAndGetAddressId.integer,
                externalizationApproval: newEvent.externalizationApproval,
                numberOfContacted: newEvent.numberOfContacted,
                isolationStartDate: newEvent.isolationStartDate,
                contactPersonLastName: newEvent.contactPersonLastName,
                contactPersonFirstName: newEvent.contactPersonFirstName,
                contactPersonPhoneNumber: newEvent.contactPersonPhoneNumber,
                contactPhoneNumber: newEvent.contactPhoneNumber,
                grade: newEvent.grade,
                transportationType: newEvent.transportationType,
                busLine: newEvent.busLine,
                busCompany: newEvent.busCompany,
                boardingStation: newEvent.boardingStation,
                endStation: newEvent.endStation,
                trainLine: newEvent.trainLine,
                cityOrigin: newEvent.cityOrigin,
                cityDestination: newEvent.cityDestination,
                airline: newEvent.airline,
                flightNum: newEvent.flightNum,
                flightDate: newEvent.flightDate,
                flightOrigin: newEvent.flightOrigin,
                flightDestination: newEvent.flightDestination,
            }
        })
    })
});

export default intersectionsRoute;