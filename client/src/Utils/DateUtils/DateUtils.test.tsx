import {  formatDateTime, truncateDate } from './formatDate'
import  getTimeSinceMessage from './timeSince'
// import {useDateUtils} from './useDateUtils'

describe('test formatDate functions', () => {
    // it('test formatDateTime', () => {
    //     const date = new Date('2021-02-15T20:33:09.078Z')
    //     const formatDate = '22:33:09 15/02/2021'
    //     formatDateTime(date)
    //     expect(formatDateTime()).toHaveReturnedWith("אין מידע")
    // })

    it('test formatDateTime', () => {
        const date = new Date('2021-02-15T20:33:09.078Z')
        const formatDate = new String ("22:33:09 15/02/2021")
        expect(formatDateTime(date)).toEqual(formatDate)
    })

    it('test truncateDate', () => {
        const date = new Date('2020-09-06T00:00:00.000Z')
        const dateInISO = '2020-09-06T06:56:51.175391+00:00'
        expect(truncateDate(dateInISO)).toEqual(date)
    })
})

describe('test timesince function', () => {
    let date = new Date();

    beforeEach(async () => {
        date = new Date();
    });

    it('test getTimeSinceMessage for yesterday date', () => {
        date.setDate(date.getDate() - 1);
        expect(getTimeSinceMessage(date, false)).toEqual('24 שעות')
    })

    it('test getTimeSinceMessage for date -now', () => {
        expect(getTimeSinceMessage(date, false)).toEqual('פחות מדקה')
    })

    it('test getTimeSinceMessage - 3 hours ago', () => {
        date.setHours(date.getHours() - 3)
        expect(getTimeSinceMessage(date, false)).toEqual('3 שעות')
    })

    it('test getTimeSinceMessage - 1 yaer ago', () => {
        date.setFullYear(date.getFullYear() - 1)
        expect(getTimeSinceMessage(date, false)).toEqual('1 שנים')
    })
})

// describe('test useDateUtils function', () => {
//     it('test useDateUtils', () => {
//         expect(useDateUtils).toEqual(undefined)
//     })
// })