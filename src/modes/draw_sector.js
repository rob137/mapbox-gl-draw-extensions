import CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
// import isEventAtCoordinates from '../lib/is_event_at_coordinates';
import createVertex from '../lib/create_vertex';
import distance from '../lib/geo_distance';
import angle from '../lib/geo_angle';
import createGeoJSONSector from '../lib/create_geo_json_sector';
import moving_direction from '../lib/moving_direction';


const DrawSector = {};

DrawSector.onSetup = function () {
    let sector = this.newFeature({
        type: Constants.geojsonTypes.FEATURE,
        properties: { '_type_': Constants.geojsonTypes.SECTOR },
        geometry: {
            type: Constants.geojsonTypes.POLYGON,
            coordinates: [[]]
        }
    });

    this.addFeature(sector);
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.SECTOR);
    this.setActionableState({ trash: true });

    return {
        sector,
        currentVertexPosition: 0
    };
};


DrawSector.onClick = function (state, e) {
    let { sector, currentVertexPosition } = state;
    if (currentVertexPosition > 1) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [sector.id] });
    }
    if (CommonSelectors.isVertex(e)) {
        this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [sector.id] });
    }
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    // 第一次 点击
    if (currentVertexPosition < 1) {
        sector.center = [e.lngLat.lng, e.lngLat.lat];
        sector.arcPoint = [e.lngLat.lng, e.lngLat.lat];
    } else {
        // 第二次点击
        sector.arcPoint = [e.lngLat.lng, e.lngLat.lat];
        // 半径
        const radius = distance(sector.center[1], sector.center[0], sector.arcPoint[1], sector.arcPoint[0]);
        sector.radius = radius;
        let offset = angle(sector.center[0], sector.center[1], sector.center[0], 0, sector.arcPoint[0], sector.arcPoint[1]);
        if (sector.arcPoint[0] - sector.center[0] > 0) {
            // arcPoint 在center 右边
            offset = Math.PI - offset;
            offset = Math.round(offset * 180 / Math.PI);
        } else {
            offset = offset - Math.PI;
            offset = Math.round(offset * 180 / Math.PI);
        }
        sector.offset = offset;
    }
    currentVertexPosition++;
    state = Object.assign(state, { currentVertexPosition, sector });
};

DrawSector.onMouseMove = function (state, e) {
    let { sector, currentVertexPosition } = state;
    let { center, arcPoint, radius } = sector;
    if (currentVertexPosition === 0) return;
    // 第一次点击之后的移动
    if (currentVertexPosition === 1) {
        radius = distance(center[1], center[0], e.lngLat.lat, e.lngLat.lng);
        sector.radius = radius;
        const coords = [center, [e.lngLat.lng, e.lngLat.lat]];
        sector.setCoordinates([coords]);
    } else {
        // 第二次点击之后的移动
        let radian = angle(center[0], center[1], arcPoint[0], arcPoint[1], e.lngLat.lng, e.lngLat.lat);
        const isClockWise = moving_direction(center[0], center[1], arcPoint[0], arcPoint[1], e.lngLat.lng, e.lngLat.lat);
        sector.isSmallerSide = +isClockWise > 0 ? true : false;
        let offset = sector.offset;
        if (!sector.isSmallerSide) {
            radian = 2 * Math.PI - radian;
        }
        const coords = createGeoJSONSector(center, radius, radian, offset, arcPoint);
        sector.radian = radian;
        sector.setCoordinates([coords]);
    }
    if (CommonSelectors.isVertex(e)) {
        this.updateUIClasses({ mouse: Constants.cursors.POINTER });
    }
    state = Object.assign(state, { sector, currentVertexPosition });
};

DrawSector.onStop = function (state) {
    let { sector, currentVertexPosition } = state;
    this.updateUIClasses({ mouse: Constants.cursors.NONE });
    doubleClickZoom.enable(this);
    this.activateUIButton();

    if (this.getFeature(sector.id) === undefined) return;
    sector.removeCoordinate(`0.${currentVertexPosition}`);
    if (sector.isValid()) {
        this.map.fire(Constants.events.CREATE, {
            features: [sector.toGeoJSON]
        });
    } else {
        this.deleteFeature([sector.id], { slient: true });
        this.changeMode(Constants.modes.SIMPLE_SELECT, {}, { slient: true });
    }
};

DrawSector.toDisplayFeatures = function (state, geojson, display) {
    let { sector, currentVertexPosition } = state;
    const isActiveSector = geojson.properties.id === sector.id;
    // const parentClass = sector.properties.class;
    geojson.properties.active = isActiveSector ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    if (!isActiveSector) return display(geojson);

    if (geojson.geometry.coordinates.length === 0) return;

    const coordinateCount = geojson.geometry.coordinates[0].length;

    if (coordinateCount < 3) return;

    display(createVertex(sector.id, geojson.geometry.coordinates[0][0], '0.0', false));

    if (currentVertexPosition === 2) {
        display(createVertex(sector.id, geojson.geometry.coordinates[0][1], '0.1', false));
    }

    if (coordinateCount <= 4) {
        const lineCoordinates = [
            [geojson.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][1]],
            [geojson.geometry.coordinates[0][1][0], geojson.geometry.coordinates[0][1][1]]
        ];
        display({
            type: Constants.geojsonTypes.FEATURE,
            properties: geojson.properties,
            geometry: {
                coordinates: lineCoordinates,
                type: Constants.geojsonTypes.LINE_STRING
            }
        });
    }

    geojson.properties.meta = Constants.meta.FEATURE;

    if (coordinateCount > 4) {
        return display(geojson);
    }
};

DrawSector.onTrash = function (state) {
    let { sector } = state;
    this.deleteFeature([sector.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT);
};

export default DrawSector;