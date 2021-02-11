const flushPromises = () => new Promise(setImmediate);

/*
 * Flush promises resolves all existing promises
 * example : 
 * 
 * await act( async () => {
 *      anAsyncAction();
 *      await flushPromises();
 * });
 * wrapper.update();
 * 
 * here we're activating an asynchronos action but not necessarily waiting for it to be resolved
 * by adding flushPromises we can make sure the action gets resloved and the wrapper will be updated appropriately
 * 
 */
export default flushPromises;