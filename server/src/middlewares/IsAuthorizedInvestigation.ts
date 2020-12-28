import { NextFunction, Request, Response } from 'express';

import logger from '../Logger/Logger';
import UserType from '../Models/User/UserType';
import { Severity } from '../Models/Logger/types';
import { graphqlRequest } from '../GraphqlHTTPRequest';
import { GET_INVESTIGATION_CREATOR } from '../DBService/InvestigationInfo/Query';

export const handleInvestigationRequest = async (    
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {user} = response.locals;
    const epidemiologynumber = parseInt(response.locals.epidemiologynumber); 
    //console.log(epidemiologynumber)
    const {investigationGroup , id} = await graphqlRequest(GET_INVESTIGATION_CREATOR, response.locals, { epidemiologynumber }).then((result: any) => {
        return result.data.investigationByEpidemiologyNumber.userByCreator;
        // authenticationLogger.info('fetched user by id successfully', Severity.LOW);
        // response.locals.user = {
        //     id: userId,
        //     name: result.data.userById?.userName,
        //     userType: result.data.userById?.userType,
        //     investigationGroup: result.data.userById?.investigationGroup,
        //     countyByInvestigationGroup: {
        //         districtId: result.data.userById?.countyByInvestigationGroup?.districtId
        //     }
        // };
        return next();
    }).catch(err => {
        console.log(err);
        //authenticationLogger.error(`error in requesting the graphql API: ${err}`, Severity.HIGH);
        response.sendStatus(500);
    });;

    if(user.userType === UserType.ADMIN || user.userType === UserType.SUPER_ADMIN) {
        return (user.countyByInvestigationGroup.districtId === investigationGroup)
        ? next()
        : response.status(401).json({ error: "unauthorized user - investigation is not in user's investigation group" });
    } else {
        return (user.id === id) 
        ? next()
        : response.status(401).json({ error: "unauthorized user - user is not creator" });
    }

}

const checkForPermission = (investigationGroup: number , id: string) => {
    
    // if()
}