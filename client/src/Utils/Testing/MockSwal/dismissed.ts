const dismissedAlert = {
    isConfirmed: false, 
    isDenied: false, 
    isDismissed: true,
};

const dismissed = jest.fn(() => Promise.resolve(dismissedAlert));

export default dismissed;