import Feature from './feature';
import Constants from '../constants';
import hat from 'hat';
import MultiPoint from './point';
import MultiLineString from './line_string';
import MultiPolygon from './polygon';

const models = {
    MultiPoint,
    MultiLineString,
    MultiPolygon
};

const takeAction = (features, action, path, lng, lat) => {
    const parts = path.split('.');
    const idx = parseInt(parts[0], 10);
    const tail = (!parts[1]) ? null : parts.slice(1).join('.');
    return features[idx][action](tail, lng, lat);
};

export default class MultiFeature extends Feature {
    constructor(...args) {
        super(...args);
        delete this.coordinates;
        this.model = models[geojson.geometry.type];
        if (this.model === undefined) throw new TypeError(`${geojson.geometry.type} is not a valid type`);
        this.features = this._coordinatesToFeatures(geojson.geometry.coordinates);
    }
    _coordinatesToFeatures(coordinates) {
        const Model = this.model.bind(this);
        return coordinates.map(coords => new Model(this.ctx, {
            id: hat(),
            type: Constants.geojsonTypes.FEATURE,
            properties: {},
            geometry: {
                coordinates: coords,
                type: this.type.replace('Multi', '')
            }
        }));
    }
    isValid() {
        return this.features.every(f => f.isValid());
    }
    setCoordinates(coords) {
        this.features = this._coordinatesToFeatures(coords);
        this.changed();
    }
    getCoordinate(path) {
        return takeAction(this.features, 'getCoordinate', path);
    }
    getCoordinates() {
        return JSON.parse(JSON.stringify(this.features.map(f => {
            if (f.type === Constants.geojsonTypes.POLYGON) return f.getCoordinates();
            return f.coordinates;
        })));
    }
    updateCoordinate(path, lng, lat) {
        takeAction(this.features, 'updateCoordinate', path, lng, lat);
        this.changed();
    }
    addCoordinate(path, lng, lat) {
        takeAction(this.features, 'addCoordinate', path, lng, lat);
        this.changed();
    }
    removeCoordinate(path) {
        takeAction(this.features, 'removeCoordinate', path);
        this.changed();
    }
    getFeatures() {
        return this.features;
    }
}



