import CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
import getArrowVertex from '../lib/get_bezier_arrow_vertex';

const DrawBezierArrow = {};
let points = [];

DrawBezierArrow.onSetup = function () {
    const bezierArrow = this.newFeature({
        type: Constants.geojsonTypes.FEATURE,
        properties: { '_type_': Constants.geojsonTypes.BEZIERARROW },
        geometry: {
            type: Constants.geojsonTypes.POLYGON,
            coordinates: [[]]
        }
    });
    this.addFeature(bezierArrow);
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.BEZIERARROW);

    this.setActionableState({ trash: true });
    return {
        bezierArrow,
        currentClickNum: 0
    };
};

DrawBezierArrow.onMouseMove = function (state, e) {
    let { bezierArrow, currentClickNum } = state;
    if (currentClickNum === 1) {
        const arrowVertex = getArrowVertex(this, points[0], this.map.project(e.lngLat));
        if (arrowVertex) {
            bezierArrow.setCoordinates([arrowVertex]);
        }
    } else if (currentClickNum === 2) {
        const arrowVertex = getArrowVertex(this, points[0], points[1], this.map.project(e.lngLat));
        if (arrowVertex) {
            bezierArrow.setCoordinates([arrowVertex]);
        }
    } else if (currentClickNum === 3) {
        this.map.fire(Constants.events.CREATE, {
            features: [bezierArrow.toGeoJSON()]
        });
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [bezierArrow.id] });
    }

    if (CommonSelectors.isVertex(e)) {
        this.updateUIClasses({ mouse: Constants.cursors.POINTER });
    }

    state = Object.assign(state, { currentClickNum, bezierArrow });
};

DrawBezierArrow.onClick = function (state, e) {
    let { bezierArrow, currentClickNum } = state;
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    if (currentClickNum < 2) {
        points.push(this.map.project(e.lngLat));
        currentClickNum++;
    } else if (currentClickNum === 2) {
        currentClickNum++;
    }

    if (CommonSelectors.isVertex(e)) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [bezierArrow.id] });
    }
    this.map.fire(Constants.events.CLICK, {
        features: [state.bezierArrow.toGeoJSON()]
    });
    state = Object.assign(state, { currentClickNum, bezierArrow });
};

DrawBezierArrow.onKeyUp = function (state) {
    let { bezierArrow } = state;
    if (CommonSelectors.isEscapeKey) {
        this.deleteFeature([bezierArrow.id], { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT);
    }
    if (CommonSelectors.isEnterKey) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [bezierArrow.id] });
    }
};

DrawBezierArrow.onStop = function (state) {
    let { bezierArrow } = state;
    this.updateUIClasses({ mouse: Constants.cursors.NONE });
    const initialDoubleClickZoomState = this.map ? this.map.doubleClickZoom.isEnabled() : true;
    if (initialDoubleClickZoomState) doubleClickZoom.enable(this);

    this.activateUIButton();

    if (this.getFeature(bezierArrow.id) === undefined) return;

    if (bezierArrow.isValid()) {
        this.map.fire(Constants.events.CREATE, {
            features: [bezierArrow.toGeoJSON()]
        });
    } else {
        this.deleteFeature([bezierArrow.id], { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
    }
    points = [];
};


DrawBezierArrow.toDisplayFeatures = function (state, geojson, display) {
    let { bezierArrow } = state;
    const isActivePolygon = geojson.properties.id === bezierArrow.id;
    geojson.properties.active = isActivePolygon ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    if (!isActivePolygon) return display(geojson);

    if (geojson.geometry.coordinates.length === 0) return;
    const coordinateCount = geojson.geometry.coordinates[0].length;
    if (coordinateCount < 3) return;
    geojson.properties.meta = Constants.meta.FEATURE;
    if (coordinateCount > 3) {
        return display(geojson);
    }

    const lineCoordinates = [
        [geojson.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][1]], [geojson.geometry.coordinates[0][1][0], geojson.geometry.coordinates[0][1][1]]
    ];
    return display({
        type: Constants.geojsonTypes.FEATURE,
        properties: geojson.properties,
        geometry: {
            coordinates: lineCoordinates,
            type: Constants.geojsonTypes.LINE_STRING
        }
    });
};

DrawBezierArrow.onTrash = function (state) {
    let { bezierArrow } = state;
    this.deleteFeature([bezierArrow.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT);
};

export default DrawBezierArrow;