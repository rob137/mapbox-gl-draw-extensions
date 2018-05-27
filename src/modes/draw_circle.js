import CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
import isEventAtCoordinates from '../lib/is_event_at_coordinates';
import createVertex from '../lib/create_vertex';
import distance from '../lib/geo_distance';
import createGeoJSONCircle from '../lib/create_geo_json_circle';



const DrawCircle = {};

DrawCircle.onSetup = function (opts) {
    let circle = this.newFeature({
        type: Constants.geojsonTypes.FEATURE,
        properties: { '_type_': Constants.geojsonTypes.CIRCLE },
        geometry: {
            type: Constants.geojsonTypes.POLYGON,
            coordinates: [[]]
        }
    });
    this.addFeature(circle);

    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.CIRCLE);
    // 以前的 actionable 方法
    this.setActionableState({
        trash: true
    });
    return {
        circle,
        currentVertexPosition: 0
    };
};


DrawCircle.onMouseMove = function (state, e) {
    let { currentVertexPosition, circle } = state;
    if (currentVertexPosition === 0) return;
    const radius = distance(circle.center[1], circle.center[0], e.lngLat.lat, e.lngLat.lng);
    const coords = createGeoJSONCircle(circle.center, radius);
    circle.setCoordinates([coords]);
    currentVertexPosition = coords.length;
    if (CommonSelectors.isVertex(e)) {
        this.updateUIClasses({ mouse: Constants.cursors.POINTER });
    }
    state = Object.assign(state, { currentVertexPosition, circle });
}

DrawCircle.onClick = function (state, e) {
    let { circle, currentVertexPosition } = state;
    // 当前 坐标点 数量大于0时，点击直接改变modes，并返回
    if (currentVertexPosition > 0) {
        return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [circle.id] });
    }
    if (CommonSelectors.isVertex(e)) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [circle.id] });
    }
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    circle.center = [e.lngLat.lng, e.lngLat.lat];
    const coords = createGeoJSONCircle([e.lngLat.lng, e.lngLat.lat], 0);
    circle.setCoordinates([coords]);
    currentVertexPosition = coords.length;
    state = Object.assign(state, { currentVertexPosition, circle });
}


DrawCircle.onKeyUp = function (state, e) {
    let { circle, currentVertexPosition } = state;
    if (CommonSelectors.isEscapeKey) {
        this.deleteFeature(circle.id, { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT);
    }
    if (CommonSelectors.isEnterKey) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [circle.id] });
    }
}

DrawCircle.onStop = function (state) {
    let { circle, currentVertexPosition } = state;
    this.updateUIClasses({ mouse: Constants.cursors.NONE });
    doubleClickZoom.enable(this);
    this.activateUIButton();
    if (this.getFeature(circle.id) === undefined) return;
    circle.removeCoordinate(`0.${currentVertexPosition}`);
    if (circle.isValid()) {
        this.map.fire(Constants.events.CREATE, {
            features: [circle.toGeoJSON()]
        });
    } else {
        debugger;
        this.deleteFeature([circle.id], { silent: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { silent: true });
    }
}

DrawCircle.toDisplayFeatures = function (state, geojson, display) {
    let { circle, currentVertexPosition } = state;
    const isActiveCircle = geojson.properties.id === circle.id;
    const parentClass = circle.properties.class;
    geojson.properties.active = isActiveCircle ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    if (!isActiveCircle) return display(geojson);

    if (geojson.geometry.coordinates.length === 0) return;

    const coordinateCount = geojson.geometry.coordinates[0].length;

    if (coordinateCount < 3) return;

    geojson.properties.meta = Constants.meta.FEATURE;


    // if (coordinateCount <= 4) {
    //     display(
    //         createVertex(circle.id, geojson.geometry.coordinates[0][0], '0.0', false, parentClass)
    //     );
    //     let endPos = geojson.geometry.coordinates[0].length - 3;
    //     display(
    //         createVertex(circle.id, geojson.geometry.coordinates[0][endPos], `0.${endPos}`, false, parentClass)
    //     );
    // }

    if (coordinateCount > 3) {
        return display(geojson);
    }
}


DrawCircle.onTrash = function (state) {
    let { circle, currentVertexPosition } = state;
    this.deleteFeature([circle.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT);
}

export default DrawCircle;