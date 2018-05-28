import isEqual from 'lodash.isequal';
import normalize from '@mapbox/geojson-normalize';
import hat from 'hat';
import featuresAt from './lib/features_at';
import stringSetsAreEqual from './lib/string_sets_are_equal';
import geojsonhint from '@mapbox/geojsonhint';
import Constants from './constants';
import StringSet from './lib/string_set';

import Polygon from './feature_types/polygon';
import LineString from './feature_types/line_string';
import Point from './feature_types/point';
import MultiPolygon from './feature_types/multi_feature';
import MultiLineString from './feature_types/multi_feature';
import MultiPoint from './feature_types/multi_feature';


const featureTypes = {
    Polygon,
    LineString,
    Point,
    MultiPolygon,
    MultiLineString,
    MultiPoint
};

export default function (ctx, api) {

    api.modes = Constants.modes;

    api.getFeatureIdsAt = function (point) {
        const features = featuresAt.click({ point }, null, ctx);
        return features.map(feature => feature.properties.id);
    };

    api.getSelectedIds = function () {
        return ctx.store.getSelectedIds();
    };

    api.getSelected = function () {
        return {
            type: Constants.geojsonTypes.FEATURE_COLLECTION,
            features: ctx.store.getSelectedIds().map(id => ctx.store.get(id)).map(feature => feature.toGeoJSON())
        };
    };

    api.getSelectedPoints = function () {
        return {
            type: Constants.geojsonTypes.FEATURE_COLLECTION,
            features: ctx.store.getSelectedCoordinates().map(coordinate => {
                return {
                    type: Constants.geojsonTypes.FEATURE,
                    properties: {},
                    geometry: {
                        type: Constants.geojsonTypes.POINT,
                        coordinates: coordinate.coordinates
                    }
                };
            })
        };
    };

    api.set = function (featureCollection) {
        if (featureCollection.type === undefined || featureCollection.type !== Constants.geojsonTypes.FEATURE_COLLECTION || !Array.isArray(featureCollection.features)) {
            throw new Error('Invalid FeatureCollection');
        }
        const renderBatch = ctx.store.createRenderBatch();
        let toDelete = ctx.store.getAllIds().slice();
        const newIds = api.add(featureCollection);
        const newIdsLookup = new StringSet(newIds);

        toDelete = toDelete.filter(id => !newIdsLookup.has(id));
        if (toDelete.length) {
            api.delete(toDelete);
        }

        renderBatch();
        return newIds;
    };

    api.add = function (geojson) {
        const errors = geojsonhint.hint(geojson, { precisionWarning: false }).filter(e => e.level !== 'message');
        if (errors.length) {
            throw new Error(errors[0].message);
        }
        const featureCollection = JSON.parse(JSON.stringify(normalize(geojson)));

        const ids = featureCollection.features.map(feature => {
            feature.id = feature.id || hat();

            if (feature.geometry === null) {
                throw new Error('Invalid geometry: null');
            }

            if (ctx.store.get(feature.id) === undefined || ctx.store.get(feature.id).type !== feature.geometry.type) {
                // If the feature has not yet been created ...
                const Model = featureTypes[feature.geometry.type];
                if (Model === undefined) {
                    throw new Error(`Invalid geometry type: ${feature.geometry.type}.`);
                }
                const internalFeature = new Model(ctx, feature);
                ctx.store.add(internalFeature);
            } else {
                // If a feature of that id has already been created, and we are swapping it out ...
                const internalFeature = ctx.store.get(feature.id);
                internalFeature.properties = feature.properties;
                if (!isEqual(internalFeature.getCoordinates(), feature.geometry.coordinates)) {
                    internalFeature.incomingCoords(feature.geometry.coordinates);
                }
            }
            return feature.id;
        });

        ctx.store.render();
        return ids;
    };


    api.get = function (id) {
        const feature = ctx.store.get(id);
        if (feature) {
            return feature.toGeoJSON();
        }
    };

    api.getAll = function () {
        return {
            type: Constants.geojsonTypes.FEATURE_COLLECTION,
            features: ctx.store.getAll().map(feature => feature.toGeoJSON())
        };
    };

    api.delete = function (featureIds) {
        ctx.store.delete(featureIds, { silent: true });
        // 如果我们处于`direct_select_mode`，则此时我们选择的feature 已经不存在了
        // (因为它已经被删除了)，我们需要退出该mode.
        if (api.getMode() === Constants.modes.DIRECT_SELECT && !ctx.store.getSelectedIds().length) {
            ctx.events.changeMode(Constants.modes.SIMPLE_SELECT, undefined, { silent: true });
        } else {
            ctx.store.render();
        }

        return api;
    };

    api.deleteAll = function () {
        ctx.store.delete(ctx.store.getAllIds(), { silent: true });
        // 如果我们处于`direct_select_mode`，则此时我们选择的feature 已经不存在了
        // 则直接退出该 mode
        if (api.getMode() === Constants.modes.DIRECT_SELECT) {
            ctx.events.changeMode(Constants.modes.SIMPLE_SELECT, undefined, { silent: true });
        } else {
            ctx.store.render();
        }

        return api;
    };

    api.changeMode = function (mode, modeOptions = {}) {
        // 使用`re-select`，而不是`changeMode`,避免因为重新改变modes造成的性能浪费
        if (mode === Constants.modes.SIMPLE_SELECT && api.getMode() === Constants.modes.SIMPLE_SELECT) {
            if (stringSetsAreEqual((modeOptions.featureIds || []), ctx.store.getSelectedIds())) return api;
            // 如果我们切换选择的都是`simple_select mode`，则直接切换。
            // 不需要停止，重启mode
            ctx.store.setSelected(modeOptions.featureIds, { silent: true });
            ctx.store.render();
            return api;
        }

        if (mode === Constants.modes.DIRECT_SELECT && api.getMode() === Constants.modes.DIRECT_SELECT &&
            modeOptions.featureId === ctx.store.getSelectedIds()[0]) {
            return api;
        }

        ctx.events.changeMode(mode, modeOptions, { silent: true });
        return api;
    };

    api.getMode = function () {
        return ctx.events.getMode();
    };

    api.trash = function () {
        ctx.events.trash({ silent: true });
        return api;
    };

    api.combineFeatures = function () {
        ctx.events.combineFeatures({ silent: true });
        return api;
    };

    api.uncombineFeatures = function () {
        ctx.events.uncombineFeatures({ silent: true });
        return api;
    };

    api.setFeatureProperty = function (featureId, property, value) {
        ctx.store.setFeatureProperty(featureId, property, value);
        return api;
    };

    return api;
};


