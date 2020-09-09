import { Router, Request, Response } from 'express';

import { graphqlRequest } from '../../GraphqlHTTPRequest'
import { CreateEventResponse } from '../../Models/ContactEvent/CreateEvent';
import { CREATE_CONTACT_EVENT_AND_GET_ID } from '../../DBService/ContactEvent/Mutation';
import ContactEvent from '../../Models/ContactEvent/ContactEvent'

const contactEventRoute = Router();

contactEventRoute.get('/', (request: Request, response: Response) => {
    response.send('Got request to contact event route');
});

contactEventRoute.post('/createContactEvent', (request: Request, response: Response) => {
    const eventData: ContactEvent = request.body.event;
    console.log('got event');
    graphqlRequest(CREATE_CONTACT_EVENT_AND_GET_ID, {
        eventInput: {
            currInvestigation: eventData.investigationId,
            eventStartTime: eventData.startTime,
            eventEndTime: eventData.endTime,
            eventBusLine: eventData.busLine,
            eventTrainLine: eventData.trainLine,
            eventBusCompany: eventData.busCompany,
            eventBoardingStation: eventData.boardingStation,
            eventEndStation: eventData.endStation,
            // eventisolationstartdate: eventData.,
            eventExternalizationApproval: eventData.externalizationApproval,
            eventPlaceType: eventData.locationType,
            eventContactPhoneNumber: eventData.buisnessContactNumber,
            eventGrade: eventData.grade,
            eventFlightNum: eventData.flightNumber,
            eventContactPersonFirstName: eventData.buisnessContactName,
            eventContactPersonLastName: eventData.buisnessContactName,
            eventContactPersonPhoneNumber: eventData.buisnessContactNumber,
            eventNumberOfContacted: eventData.numberOfContacted,
            eventCityOrigin: eventData.boardingCity,
            eventCityDestination: eventData.endCity,
            eventTransportationType: eventData.locationSubType,
            eventLocationAddress: JSON.stringify(eventData.locationAddress),
            eventFlightOriginCountry: eventData.boardingCountry,
            eventFlightOriginCity: eventData.boardingCity,
            eventFlightOriginAirport: eventData.boardingCity,
            eventFlightDestinationCountry: eventData.endCountry,
            eventFlightDestinationAirport: eventData.endCity,
            eventPlaceSubType: eventData.locationSubType
        }})
        .then((res: any) => {
            console.log(res);
            // response.send(eventCreationResponse.data.createEvent.integer);
    });
});

export default contactEventRoute;