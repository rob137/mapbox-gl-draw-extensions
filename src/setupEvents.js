import constants from './constants';
import Record from './history/record';

const eventsType = {
    [constants.events.DELETE]: 1,
    [constants.events.UPDATE]: 2,
    [constants.events.CREATE]: 3,
    [constants.events.REPLACE]: 4
};

const eventsAction = {
    [constants.updateActions.MOVE]: 1,
    [constants.updateActions.CHANGE_COORDINATES]: 2,
    [constants.updateActions.CHANGE_PROPERTIES]: 3
};

// function ObjectAccumulator(obj, key, value) {
//     key in obj ? Object.defineProperty(obj, key, {
//         value,
//         enumerable: true,
//         configurable: true,
//         writable: false
//     }) : obj[key] = value;
//     return obj;
// }

let ctx = {
    type: eventsType,
    action: eventsAction
}

// events = Object.keys(events).reduce((accumulator, currentKey) => {
//     const currentValue = events[currentKey];
//     for (let key in currentValue) {
//         if (currentValue.hasOwnProperty(key)) {
//             let value = currentValue[key];
//             ObjectAccumulator(accumulator, key, value);
//         }
//     }
//     events[currentKey] = accumulator;
// }, {});

export default function (draw, map, history, container) {

    const eventsApi = Object.assign({}, {
        onDrawCreate: function (evt) {
            const record = new Record(3, 0, evt.features);
            history.addRecord(record);
            map.fire(constants.events.RECORD_CREATE, {
                record: record
            });
        },
        onDrawUpdate: function (evt) {
            const record = new Record(2, ctx.action[evt.action] || 0, evt.features, evt.prevFeatures);
            history.addRecord(record);
            map.fire(constants.events.RECORD_CREATE, {
                record: record
            });
        },
        onDrawDelete: function (evt) {
            const record = new Record(1, 0, evt.features);
            history.addRecord(record);
            map.fire(constants.events.RECORD_CREATE, {
                record: record
            });
        },
        onDrawCombine: function (evt) {
            const record = new Record(4, 0, evt.createdFeatures, evt.deletedFeatures);
            history.addRecord(record);
            map.fire(constants.events.RECORD_CREATE, {
                record: record
            });
        },
        onDrawUncombine: function (evt) {
            const record = new Record(4, 0, evt.createdFeatures, evt.deletedFeatures);
            history.addRecord(record);
            map.fire(constants.events.RECORD_CREATE, {
                record: record
            });
        },
        onDrawReplace: function (evt) {
            const record = new Record(4, 0, evt.createdFeatures, evt.deletedFeatures);
            history.addRecord(record);
            map.fire(constants.events.RECORD_CREATE, {
                record: record
            });
        },
        onKeydown: function (evt) {
            if (evt.keyCode === 90) {
                evt.preventDefault();
                api.undoHistory();
            } else if (evt.keyCode === 89) {
                evt.preventDefault();
                api.redoHistory();
            }
        }
    });

    const api = {
        addEventListeners: function () {
            if (!map) return;
            map.on(constants.events.CREATE, eventsApi.onDrawCreate);
            map.on(constants.events.UPDATE, eventsApi.onDrawUpdate);
            map.on(constants.events.DELETE, eventsApi.onDrawDelete);
            map.on(constants.events.COMBINE_FEATURES, eventsApi.onDrawCombine);
            map.on(constants.events.UNCOMBINE_FEATURES, eventsApi.onDrawUncombine);
            map.on(constants.events.REPLACE, eventsApi.onDrawReplace);
            container.addEventListener('keydown', eventsApi.onKeydown);
        },
        removeEventListeners: function () {
            if (!map) return;
            map.off(constants.events.CREATE, eventsApi.onDrawCreate);
            map.off(constants.events.UPDATE, eventsApi.onDrawUpdate);
            map.off(constants.events.DELETE, eventsApi.onDrawDelete);
            map.off(constants.events.COMBINE_FEATURES, eventsApi.onDrawCombine);
            map.off(constants.events.UNCOMBINE_FEATURES, eventsApi.onDrawUncombine);
            map.off(constants.events.REPLACE, eventsApi.onDrawReplace);
            container.removeEventListener('keydown', eventsApi.onKeydown);
        },
        // t=> draw , e=> map , n=> history , s=> container
        undoHistory: function () {
            if (draw && history) {
                const record = history.undoRecord();
                if (record) {
                    const type = record.getType();
                    switch (type) {
                        case 1:
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                features.map(feature => {
                                    draw.add(Object.assign({}, feature, {
                                        type: feature.type || constants.geojsonTypes.FEATURE
                                    }));
                                });
                                const featureIds = features.map(f => f.id);
                                draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds })
                            }
                            break;
                        case 2:
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                const featureIds = features.map(f => f.id);
                                draw.delete(featureIds);
                            }
                            const prevFeatures = record.getPrevFeatures();
                            if (prevFeatures.length > 0) {
                                prevFeatures.map(pf => {
                                    draw.add(Object.assign({}, pf, {
                                        type: pf.type || constants.geojsonTypes.FEATURE
                                    }));
                                });
                                const featureIds = prevFeatures.map(f => f.id);
                                draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds });
                            }
                            break;
                        case 3:
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                const featureIds = features.map(f => f.id);
                                draw.delete(featureIds);
                            }
                            break;
                        case 4:
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                const featureIds = features.map(f => f.id);
                                draw.delete(featureIds);
                            }
                            const prevFeatures = record.getPrevFeatures();
                            if (prevFeatures.length > 0) {
                                prevFeatures.map(f => {
                                    draw.add(Object.assign({}, f, {
                                        type: f.type || constants.geojsonTypes.FEATURE
                                    }));
                                });
                                const featureIds = prevFeatures.map(f => f.id);
                                draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds });
                            }
                            break;
                        default:
                            break;
                    }
                    map.fire(constants.events.UNDO, { record });
                }
            }
        },
        redoHistory: function () {
            if (draw && history) {
                const record = history.redoRecord();
                if (record) {
                    draw.getAll();
                    const type = record.getType();
                    switch (type) {
                        case 3:
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                features.map(f => {
                                    draw.add(Object.assign({}, f, {
                                        type: f.type || constants.geojsonTypes.FEATURE
                                    }));
                                });
                                const featureIds = features.map(f => f.id);
                                draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds });
                            }
                            break;
                        case 2:
                            const prevFeatures = record.getPrevFeatures();
                            if (prevFeatures.length > 0) {
                                const featureIds = prevFeatures.map(f => f.id);
                                draw.delete(featureIds);
                            }
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                features.map(f => {
                                    draw.add(Object.assign({}, f, {
                                        type: f.type || constants.geojsonTypes.FEATURE
                                    }));
                                });
                                const featureIds = features.map(f => f.id);
                                draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds });
                            }
                            break;
                        case 1:
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                const featureIds = features.map(f => f.id);
                                draw.delete(featureIds);
                            }
                            break;
                        case 4:
                            const prevFeatures = record.getPrevFeatures();
                            if (prevFeatures.length > 0) {
                                const featureIds = prevFeatures.map(f => f.id);
                                draw.delete(featureIds);
                            }
                            const features = record.getFeatures();
                            if (features.length > 0) {
                                features.map(f => {
                                    draw.add(Object.assign({}, f, {
                                        type: f.type || constants.geojsonTypes.FEATURE
                                    }));
                                });
                                const featureIds = features.map(f => f.id);
                                draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds });
                            }
                            break;
                        default:
                            break;
                    }

                    map.fire(constants.events.REDO, { record });
                }
            }
        }
    }

    return api;
}
