import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { getStreetByCity } from 'Utils/Address/AddressUtils';
import flushPromises from '../Testing/flushPromises';

const mockAxios = new MockAdapter(axios);

describe('getStreetByCity', () => {
    it('should return Avnei Chefetz streets', async () => {
        const avniChefetzStreets = [
            { displayName: "אודם", id: "1038" },
            { displayName: "איבי הנחל", id: "1820" }
        ];

        let expectedMapAvniHefetz = new Map();
        expectedMapAvniHefetz.set('1038', avniChefetzStreets[0]);
        expectedMapAvniHefetz.set('1820', avniChefetzStreets[1]);
        const avniChefetzCityId = '3793';

        mockAxios.onGet(`/addressDetails/city/${avniChefetzCityId}/streets`).reply(200, avniChefetzStreets);

        const mockcallback = jest.fn()
        getStreetByCity(avniChefetzCityId, mockcallback);
        await flushPromises();
        expect(mockcallback).toBeCalled()
        expect(mockcallback).toHaveBeenCalledWith(expectedMapAvniHefetz);
    });

    it('should return undefined', async () => {
        const admitStreets = [{}];

        let expectedMapAdmit = new Map();
        expectedMapAdmit.set(undefined, {});
        const admitCityId = '1068';

        mockAxios.onGet(`/addressDetails/city/${admitCityId}/streets`).reply(200, admitStreets);

        const mockcallback = jest.fn()
        getStreetByCity(admitCityId, mockcallback);
        await flushPromises();
        expect(mockcallback).toBeCalled()
        expect(mockcallback).toHaveBeenCalledWith(expectedMapAdmit);
    });

    it('should return error', async () => {
        const undefinedStreets = [{}];

        let expectedMapundefined = new Map();
        expectedMapundefined.set(undefined, {});
        const undefinedCityId = '1';

        mockAxios.onGet(`/addressDetails/city/${undefinedCityId}/streets`).reply(200, undefinedStreets);

        const mockcallback = jest.fn()
        getStreetByCity(undefinedCityId, mockcallback);
        await flushPromises();
        expect(mockcallback).toBeCalled()
        expect(mockcallback).toHaveBeenCalledWith(expectedMapundefined);
    });
})