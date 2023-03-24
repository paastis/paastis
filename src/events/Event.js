export class Event {

    name;
    date;
    objectId;

    constructor(name, objectId) {
        this.name = name;
        this.date = new Date(Date.now());
        this.objectId = objectId;
    }

}

export class AppRegistered extends Event {

    constructor(appKey) {
        super('APP_REGISTERED', appKey);
    }
}

export class AppUnregistered extends Event {
    constructor(appKey) {
        super('APP_UNREGISTERED', appKey);
    }
}

export class AppStopped extends Event {
    constructor(appKey) {
        super('APP_STOPPED', appKey);
    }
}

export class AppStarted extends Event {
    constructor(appKey) {
        super('APP_STARTED', appKey);
    }
}

