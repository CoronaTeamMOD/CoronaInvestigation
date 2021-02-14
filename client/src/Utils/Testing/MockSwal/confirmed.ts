export const confirmedAlert = { 
    isConfirmed: true, 
    isDenied: false, 
    isDismissed: false, 
    value: true 
};

const confirmed = jest.fn(() => Promise.resolve(confirmedAlert));

export default confirmed;