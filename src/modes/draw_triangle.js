import CommonSelector from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
import isEventAtCoordinates from '../lib/is_event_at_coordinates';
import createVertex from '../lib/create_vertex';



const DrawTriangle = {};


DrawTriangle.onSetup = function () {
    const triangle = this.newFeature({
        type: Constants.geojsonTypes.FEATURE,
        properties: { '_type_': Constants.geojsonTypes.TRIANGLE },
        geometry: {
            type: Constants.geojsonTypes.POLYGON,
            coordinates: [[]]
        }
    });

    this.addFeature(triangle);

    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.TRIANGLE);

    this.setActionableState({ trash: true });

    return {
        triangle,
        currentVertexPosition: 0
    };
};


DrawTriangle.clickAnywhere = function (state, e) {
    let { triangle, currentVertexPosition } = state;
    if (currentVertexPosition > 0 && isEventAtCoordinates(e, triangle.coordinates[0][currentVertexPosition - 1])) {
        return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [triangle.id] });
    }
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    triangle.updateCoordinate(`0.${currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
    currentVertexPosition++;
    triangle.updateCoordinate(`0.${currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
    state = Object.assign(state, { triangle, currentVertexPosition });
    // 当 点数为3时，结束绘制
    if (currentVertexPosition >= 3) {
        return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [triangle.id] });
    }
};

DrawTriangle.clickOnVertex = function (state, e) {
    let { triangle, currentVertexPosition } = state;
    return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [triangle.id] });
};

DrawTriangle.onTap = DrawTriangle.onClick = function (state, e) {
    if (CommonSelector.isVertex(e)) return this.clickOnVertex(state, e);
    return this.clickAnywhere(state, e);
};

DrawTriangle.onKeyUp = function (state, e) {
    let { triangle, currentVertexPosition } = state;
    if (CommonSelector.isEscapeKey(e)) {
        this.deleteFeature([triangle.id], { slient: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT);
    } else if (CommonSelector.isEnterKey(e)) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [triangle.id] });
    }
};

DrawTriangle.onMouseMove = function (state, e) {
    let { triangle, currentVertexPosition } = state;
    triangle.updateCoordinate(`0.${currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
    if (CommonSelector.isVertex(e)) {
        this.updateUIClasses({ mouse: Constants.cursors.POINTER });
    }
};

DrawTriangle.onStop = function (state) {
    let { triangle, currentVertexPosition } = state;
    this.updateUIClasses({ mouse: Constants.cursors.NONE });
    doubleClickZoom.enable(this);
    this.activateUIButton();
    if (this.getFeature(triangle.id) === undefined) return;
    triangle.removeCoordinate(`0.${currentVertexPosition}`);

    if (triangle.isValid()) {
        this.map.fire(Constants.events.CREATE, {
            features: [triangle.toGeoJSON()]
        });
    } else {
        this.deleteFeature([triangle.id], { slient: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { slient: true });
    }
};

DrawTriangle.toDisplayFeatures = function (state, geojson, display) {
    let { triangle, currentVertexPosition } = state;
    const isActiveTriangle = geojson.properties.id === triangle.id;
    geojson.properties.active = (isActiveTriangle) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    if (!isActiveTriangle) return display(geojson);
    // Don't render a polygon until it has two positions
    // (and a 3rd which is just the first repeated)
    if (geojson.geometry.coordinates.length === 0) return;

    // 2 coordinates after selecting a draw type
    // 3 after creating the first point
    const coordinateCount = geojson.geometry.coordinates[0].length;

    if (coordinateCount < 3) return;

    geojson.properties.meta = Constants.meta.FEATURE;
    display(
        createVertex(triangle.id, geojson.geometry.coordinates[0][0], '0.0', false)
    );
    if (coordinateCount > 3) {
        const endPos = geojson.geometry.coordinates[0].length - 3;
        display(
            createVertex(triangle.id, geojson.geometry.coordinates[0][endPos], `0.${endPos}`, false)
        )
    }
    if (coordinateCount <= 4) {
        // If we've only drawn two positions (plus the closer),
        // make a LineString instead of a Polygon
        const lineCoordinates = [
            [geojson.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][1]],
            [geojson.geometry.coordinates[0][1][0], geojson.geometry.coordinates[0][1][1]]
        ];
        // create an initial vertex so that we can track the first point on mobile devices
        display({
            type: Constants.geojsonTypes.FEATURE,
            properties: geojson.properties,
            geometry: {
                coordinates: lineCoordinates,
                type: Constants.geojsonTypes.LINE_STRING
            }
        });
        if (coordinateCount === 3) return;
    }
    return display(geojson);
};

DrawTriangle.onTrash = function (state) {
    let { triangle, currentVertexPosition } = state;
    this.deleteFeature([triangle.id], { slient: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT);
};

export default DrawTriangle;
