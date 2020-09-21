class Observer {

    _observants: Map<number, () => void>;

    constructor () {
        this._observants = new Map<number, () => void>();
    }

    subscribe(id: number, gotObserverUpdate: () => void) {
        this._observants.set(id, gotObserverUpdate);
    }

    notifyAll() {
        this._observants.forEach(notification => notification());
    }

    notifySpecific(id: number) {
        const functionToNotify = this._observants.get(id);
        if (functionToNotify === undefined) {
            throw new Error('try to notify someone who didnt subscribe');
        } else {
            functionToNotify();
        }
    }
}

export default Observer; 