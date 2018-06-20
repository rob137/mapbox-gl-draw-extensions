import setupDraw from './setupDraw';
import constants from './constants';
import History from './history/history';
import setupEvents from './setupEvents';

export default function (context = {}) {
    const ctx = context;
    ctx.map = null;
    ctx.options = {};
    ctx.controlPosition = null;
    ctx.events = null;
    ctx.draw = null;
    ctx.history = null;
    ctx.container = null;

    const initDraw = function () {
        return {
            options: ctx.options || {},
            controlPosition: ctx.controlPosition || void 0,
            draw: ctx.draw || null
        };
    };

    return {
        init: function (map, options, controlPosition) {
            ctx.draw = new setupDraw(options);
            ctx.map = map;
            ctx.map.addControl(ctx.draw, controlPosition);
            ctx.options = options;
            ctx.controlPosition = controlPosition;
            ctx.container = map.getContainer();

            if (ctx.history) {
                ctx.history = null;
            }
            if (ctx.event) {
                ctx.event.removeEventListeners();
                ctx.event = null;
            }
            ctx.history = new History();
            ctx.event = new setupEvents(ctx.draw, ctx.map, ctx.history, ctx.container);
            ctx.event.addEventListeners();

            return initDraw();
        },
        setOptions: function (options) {
            if (ctx.draw && ctx.map) {
                ctx.map.removeControl(ctx.draw);
                ctx.draw = null;
            }
            ctx.draw = new setupDraw(options);
            ctx.map.addControl(ctx.draw, ctx.controlPosition);
            ctx.options = options;
            if (ctx.history) {
                ctx.history = null;
            }
            if (ctx.event) {
                ctx.event.removeEventListeners();
                ctx.event = null;
            }
            ctx.history = new History();
            ctx.event = new setupEvents(ctx.draw, ctx.map, ctx.history, ctx.container);
            ctx.event.addEventListeners();
            return initDraw();
        },
        dispose: function () {
            if (ctx.draw && ctx.map) {
                ctx.map.removeControl(ctx.draw);
                ctx.draw = null;
            }
            if (ctx.history) {
                ctx.history = null;
            }
            if (ctx.event) {
                ctx.event.removeEventListeners();
                ctx.event = null;
            }
            delete ctx.map;
            delete ctx.options;
            delete ctx.controlPosition;
            delete ctx.history;
            delete ctx.event;
            delete ctx.draw;
            delete ctx.container;

            return initDraw;
        },
        undoOperation: function () {
            if (ctx.event) {
                ctx.event.undoHistory();
            }
        },
        redoOperation: function () {
            if (ctx.event) {
                ctx.event.redoHistory();
            }
        },
        setFeatures: function (featureCollection) {
            ctx.draw.changeMode(constants.modes.SIMPLE_SELECT);
            ctx.draw.set(featureCollection);
        },
        removeFeatures: function (ids) {
            if (!Array.isArray(ids)) {
                throw new Error('Invalid featureIds');
            }
            if (ids.length === 0) {
                throw new Error('featureIds不能为空');
            }
            ctx.draw.changeMode(constants.modes.SIMPLE_SELECT, {
                featureIds: ids
            });
            ctx.draw.trash();
            return ids;
        },
        setSelected: function (ids) {
            if (!Array.isArray(ids)) {
                throw new Error('invalid featureIds');
            }
            ctx.draw.changeMode(constants.modes.SIMPLE_SELECT, { featureIds: ids });
            return ids;
        },
        setFeatureProperties: function (feature, props) {
            for (let key in props) {
                if (props.hasOwnProperty(key)) {
                    let value = props[key];
                    ctx.draw.setFeatureProperty(feature, key, value);
                }
            }
            return ctx.draw.get(feature);
        },
        getAllHistoryRecords: function () {
            return ctx.history ? ctx.history.getAllRecords() : [];
        },
        clearHistoryRecords: function () {
            if (ctx.history) {
                ctx.history.clear();
            }
        }
    };
}