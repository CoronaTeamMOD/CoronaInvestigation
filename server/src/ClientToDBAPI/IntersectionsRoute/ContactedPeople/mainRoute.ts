import { Router, Request, Response } from 'express';

import { GET_ALL_CONTACTED_PEOPLE_BY_EVENT } from '../../../DBService/ContactedPeople/Query';
import { ADD_CONTACTED_PERSON_TO_EVENT } from '../../../DBService/ContactedPeople/Mutation';