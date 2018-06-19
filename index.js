import btn_ctrl from './src/modes/btn_ctrl';
import draw_handler from './src/draw_handler';

let MapboxDraw = {};
const ctx = {};
const drawApi = draw_handler(ctx);

MapboxDraw = Object.assign(MapboxDraw, {
    init: function (map, options, controlPosition) {
        return Object.assign(MapboxDraw, drawApi.init(map, options, controlPosition));
    },
    setOptions: function (options) {
        return Object.assign(MapboxDraw, drawApi.setOptions(options));
    },
    dispose: function () {
        return Object.assign(MapboxDraw, drawApi.dispose());
    },
    undoOperation: function () {
        drawApi.undoOperation();
    },
    redoOperation: function () {
        drawApi.redoOperation();
    },
    onBtnCtrlActive: function (mode) {
        btn_ctrl(this, mode);
    },
    setFeatures: function (features) {
        return drawApi.setFeatures(features);
    },
    removeFeatures: function (features) {
        return drawApi.removeFeatures(features);
    },
    setSelected: function (feature) {
        return drawApi.setSelected(feature);
    },
    setFeatureProperties: function (feature, props) {
        return drawApi.setFeatureProperties(feature, props);
    },
    getAllHistoryRecords: function () {
        return drawApi.getAllHistoryRecords();
    },
    clearHistoryRecords: function () {
        return drawApi.clearHistoryRecords();
    }
});

export default MapboxDraw;