import CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
import getArrowVertex from '../lib/getArrowVertex';

const DrawArrow = {};
let center = {
    x: 0,
    y: 0
};

DrawArrow.onSetup = function () {
    const arrow = this.newFeature({
        type: Constants.geojsonTypes.FEATURE,
        properties: { '_type_': Constants.geojsonTypes.ARROW },
        geometry: {
            type: Constants.geojsonTypes.POLYGON,
            coordinates: [[]]
        }
    });

    this.addFeature(arrow);

    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.ARROW);

    this.setActionableState({ trash: true });

    return {
        arrow,
        currentClickNum: 0
    };
};

DrawArrow.onMouseMove = function (state, e) {
    let { arrow, currentClickNum } = state;
    if (currentClickNum === 1) {
        const arrowVertex = getArrowVertex(this, center, this.map.project(e.lngLat));
        if (arrowVertex) {
            arrow.setCoordinates([arrowVertex]);
        }
    } else if (currentClickNum === 2) {
        this.map.fire(Constants.events.CREATE, {
            features: [arrow.toGeoJSON()]
        });
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [arrow.id] });
    }
    if (CommonSelectors.isVertex(e)) {
        this.updateUIClasses({ mouse: Constants.cursors.POINTER });
    }
    state = Object.assign(state, { currentClickNum, arrow });
};

DrawArrow.onClick = function (state, e) {
    let { arrow, currentClickNum } = state;
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    if (currentClickNum === 0) {
        center = this.map.project(e.lngLat);
        currentClickNum++;
    } else if (currentClickNum === 1) {
        currentClickNum++;
    }
    if (CommonSelectors.isVertex(e)) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [arrow.id] });
    }
    state = Object.assign(state, { currentClickNum, arrow });
};

DrawArrow.onKeyUp = function (state) {
    let { arrow } = state;
    if (CommonSelectors.isEscapeKey) {
        this.deleteFeature([arrow.id], { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT);
    }
    if (CommonSelectors.isEnterKey) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [arrow.id] });
    }
};

DrawArrow.onStop = function (state) {
    let { arrow } = state;
    this.updateUIClasses({ mouse: Constants.cursors.NONE });
    const initialDoubleClickZoomState = this.map ? this.map.doubleClickZoom.isEnabled() : true;
    if (initialDoubleClickZoomState) {
        doubleClickZoom.enable(this);
    }
    this.activateUIButton();

    if (this.getFeature(arrow.id) === undefined) return;

    if (arrow.isValid()) {
        this.map.fire(Constants.events.CREATE, {
            features: [arrow.toGeoJSON()]
        });
    } else {
        this.deleteFeature([arrow.id], { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
    }
};

DrawArrow.toDisplayFeatures = function (state, geojson, display) {
    let { arrow } = state;
    const isActivePolygon = geojson.properties.id === arrow.id;
    geojson.properties.active = isActivePolygon ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    if (!isActivePolygon) return display(geojson);

    if (geojson.geometry.coordinates.length === 0) return;

    const coordinateCount = geojson.geometry.coordinates[0].length;
    if (coordinateCount < 3) return;
    geojson.properties.meta = Constants.meta.FEATURE;
    if (coordinateCount > 3) {
        return display(geojson);
    }

    // If we've only drawn two positions (plus the closer),
    // make a LineString instead of a Polygon
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

DrawArrow.onTrash = function (state) {
    let { arrow } = state;
    this.deleteFeature([arrow.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT);
};

export default DrawArrow;