import CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
import isEventAtCoordinates from '../lib/is_event_at_coordinates';
import createVertex from '../lib/create_vertex';
import createGeoJSONRectangle from '../lib/create_geo_json_rectangle';



const DrawRectangle = {};


DrawRectangle.onSetup = function (opts) {
    let rectangle = this.newFeature({
        type: Constants.geojsonTypes.FEATURE,
        properties: { '_type_': Constants.geojsonTypes.RECTANGLE },
        geometry: {
            type: Constants.geojsonTypes.POLYGON,
            coordinates: [[]]
        }
    });

    this.addFeature(rectangle);

    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.RECTANGLE);

    this.setActionableState({ trash: true });
    return {
        rectangle,
        currentVertexPosition: 0
    };
};

DrawRectangle.onClick = function (state, e) {
    let { rectangle, currentVertexPosition } = state;
    if (currentVertexPosition > 0) {
        return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [rectangle.id] });
    }
    if (CommonSelectors.isVertex(e)) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [rectangle.id] });
    }

    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    rectangle.ltPoint = [e.lngLat.lng, e.lngLat.lat];
    const coords = createGeoJSONRectangle(rectangle.ltPoint, rectangle.ltPoint);
    rectangle.setCoordinates([coords]);
    currentVertexPosition = coords.length;
    state = Object.assign(state, { rectangle, currentVertexPosition });
}

DrawRectangle.onMouseMove = function (state, e) {
    let { rectangle, currentVertexPosition } = state;
    if (currentVertexPosition === 0) return;
    const rbPoint = [e.lngLat.lng, e.lngLat.lat];
    rectangle.rbPoint = rbPoint;
    const coords = createGeoJSONRectangle(rectangle.ltPoint, rbPoint);
    rectangle.setCoordinates([coords]);
    currentVertexPosition = coords.length;
    if (CommonSelectors.isVertex(e)) {
        this.updateUIClasses({ mouse: Constants.cursors.POINTER });
    }
    state = Object.assign(state, { currentVertexPosition, rectangle });
}

DrawRectangle.onStop = function (state) {
    let { rectangle, currentVertexPosition } = state;
    this.updateUIClasses({ mouse: Constants.cursors.NONE });
    doubleClickZoom.enable(this);
    this.activateUIButton();
    if (this.getFeature(rectangle.id) === undefined) return;
    rectangle.removeCoordinate(`0.${currentVertexPosition}`);
    if (rectangle.isValid()) {
        this.map.fire(Constants.events.CREATE, {
            features: [rectangle.toGeoJSON()]
        });
    } else {
        this.deleteFeature([rectangle.id], { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
    }
}

DrawRectangle.toDisplayFeatures = function (state, geojson, display) {
    let { rectangle, currentVertexPosition } = state;
    const isActiveRectangle = geojson.properties.id === rectangle.id;
    const parentClass = rectangle.properties.class;
    geojson.properties.active = isActiveRectangle ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;

    if (!isActiveRectangle) return display(geojson);
    if (geojson.geometry.coordinates.length === 0) return;
    const coordinateCount = geojson.geometry.coordinates[0].length;
    if (coordinateCount < 4) return;

    geojson.properties.meta = Constants.meta.FEATURE;
    display(createVertex(rectangle.id, geojson.geometry.coordinates[0][0], '0.0', false));
    if (coordinateCount > 5) {
        const endPos = geojson.geometry.coordinates[0].length - 4;
        display(
            createVertex(rectangle.id, geojson.geometry.coordinates[0][endPos], `0.${endPos}`, false)
        );
    }

    return display(geojson);
}

export default DrawRectangle;