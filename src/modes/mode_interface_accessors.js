import Constants from '../constants';
import featuresAt from '../lib/features_at';
import Point from '../feature_types/point';
import LineString from '../feature_types/line_string';
import Polygon from '../feature_types/polygon';
import MultiFeature from '../feature_types/multi_feature';
import Sector from '../feature_types/sector';

export default class ModeInterface {
    constructor(ctx) {
        this.map = ctx.map;
        this.drawConfig = JSON.parse(JSON.stringify(ctx.options || {}));
        this._ctx = ctx;
    }
    setSelected(features) {
        return this._ctx.store.setSelected(features);
    }
    setSelectedCoordinates(coords) {
        this._ctx.store.setSelectedCoordinates(coords);
        coords.reduce((m, c) => {
            if (m[c.feature_id] === undefined) {
                m[c.feature_id] = true;
                this._ctx.store.get(c.feature_id).changed();
            }
            return m;
        }, {});
    }
    getSelected() {
        return this._ctx.store.getSelected();
    }
    getSelectedIds() {
        return this._ctx.store.getSelectedIds();
    }
    isSelected(id) {
        return this._ctx.store.isSelected(id);
    }
    getFeature(id) {
        return this._ctx.store.get(id);
    }
    select(id) {
        return this._ctx.store.select(id);
    }
    deselect(id) {
        return this._ctx.store.deselect(id);
    }
    deleteFeature(id, opts = {}) {
        return this._ctx.store.delete(id, opts);
    }
    addFeature(feature) {
        return this._ctx.store.add(feature);
    }
    clearSelectedFeatures() {
        return this._ctx.store.clearSelected();
    }
    clearSelectedCoordinates() {
        return this._ctx.store.clearSelectedCoordinates();
    }
    setActionableState(actions = {}) {
        const newSet = {
            trash: actions.trash || false,
            combineFeatures: actions.combineFeatures || false,
            uncombineFeatures: actions.uncombineFeatures || false
        };
        return this._ctx.events.actionable(newSet);
    }
    changeMode(mode, opts = {}, eventOpts = {}) {
        return this._ctx.events.changeMode(mode, opts, eventOpts);
    }
    updateUIClasses(opts) {
        return this._ctx.ui.queueMapClasses(opts);
    }
    activateUIButton(name) {
        return this._ctx.ui.setActiveButton(name);
    }
    featuresAt(event, bbox, bufferType = 'click') {
        if (bufferType !== 'click' && bufferType !== 'touch') throw new Error('invalid buffer type');
        return featuresAt[bufferType](event, bbox, this._ctx);
    }
    newFeature(geojson) {
        const type = geojson.geometry.type;
        // const _type_ = geojson.properties._type_;
        if (type === Constants.geojsonTypes.POINT) return new Point(this._ctx, geojson);
        if (type === Constants.geojsonTypes.LINE_STRING) return new LineString(this._ctx, geojson);
        if (type === Constants.geojsonTypes.POLYGON) return new Polygon(this._ctx, geojson);
        return new MultiFeature(this._ctx, geojson);
    }
    newRectangle() {

    }
    newTriangle() {

    }
    newSector(geojson) {
        return new Sector(this._ctx, geojson);
    }
    newEllipse() {

    }
    newArc() {

    }
    isInstanceOf(type, feature) {
        if (type === Constants.geojsonTypes.POINT) return feature instanceof Point;
        if (type === Constants.geojsonTypes.LINE_STRING) return feature instanceof LineString;
        if (type === Constants.geojsonTypes.POLYGON) return feature instanceof Polygon;
        if (type === 'MultiFeature') return feature instanceof MultiFeature;
        throw new Error(`Unknown feature class: ${type}`);
    }
    doRender(id) {
        return this._ctx.store.featureChanged(id);
    }
}