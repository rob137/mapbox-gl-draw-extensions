export default class Record {
    constructor(type = 0, action = 0, features = [], prevFeatures = []) {
        this.type = type;
        this.action = action;
        this.features = features;
        this.prevFeatures = prevFeatures;
    }
    getType() {
        return this.type;
    }
    getAction() {
        return this.action;
    }
    getFeatures() {
        return this.features;
    }
    getPrevFeatures() {
        return this.prevFeatures;
    }
}