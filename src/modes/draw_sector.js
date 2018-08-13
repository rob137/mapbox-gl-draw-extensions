import CommonSelectors from '../lib/common_selectors';
import doubleClickZoom from '../lib/double_click_zoom';
import Constants from '../constants';
import createVertex from '../lib/create_vertex';

const DrawSector = {};

DrawSector.onSetup = function () {
    let sector = this.newSector({
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
        return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [sector.id] });
    }
    if (CommonSelectors.isVertex(e)) {
        return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [sector.id] });
    }
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    sector.updateCoordinate('0.' + currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
    currentVertexPosition++;
    this.map.fire(Constants.events.CLICK, Object.assign(e, {
        features: [state.sector.toGeoJSON()],
    }));
    state = Object.assign(state, { currentVertexPosition, sector });
};

DrawSector.onMouseMove = function (state, e) {
    let { sector, currentVertexPosition } = state;
    // let { center, arcPoint, radius } = sector;
    if (currentVertexPosition === 0) return;

    sector.updateCoordinate('0.' + currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
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
            features: [sector.toGeoJSON()]
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

    geojson.properties.meta = Constants.meta.FEATURE;
    display(createVertex(sector.id, geojson.geometry.coordinates[0][0], '0.0', false));
    if (coordinateCount > 4) {
        const len = geojson.geometry.coordinates[0].length - 1;
        display(createVertex(sector.id, geojson.geometry.coordinates[0][len], '0.' + len, false));
    }

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
        if (coordinateCount === 3) return;
    }
    // geojson.properties.meta = Constants.meta.FEATURE;
    return display(geojson);
};

DrawSector.onTrash = function (state) {
    let { sector } = state;
    this.deleteFeature([sector.id], { silent: true });
    this.changeMode(Constants.modes.SIMPLE_SELECT);
};

export default DrawSector;