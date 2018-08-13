import * as turf from '@turf/turf';
import Feature from './feature';

export default class Sector extends Feature {
    constructor(ctx, geojson) {
        super(ctx, geojson);
        this.coordinates = this.coordinates.map(ring => ring.slice(0, -1));
    }
    isValid() {
        if (this.coordinates.length === 0) return false;
        return this.coordinates.every(ring => ring.length > 2);
    }
    // Expects valid geoJSON polygon geometry: first and last positions must be equivalent.
    incomingCoords(coords) {
        this.coordinates = coords.map(ring => ring.slice(0, -1));
        this.changed();
    }
    // Does NOT expect valid geoJSON polygon geometry: first and last positions should not be equivalent.
    setCoordinates(coords) {
        this.coordinates = coords;
        this.changed();
    }
    addCoordinate(path, lng, lat) {
        this.changed();
        const ids = path.split('.').map(x => parseInt(x, 10));

        const ring = this.coordinates[ids[0]];

        ring.splice(ids[1], 0, [lng, lat]);
    }
    removeCoordinate(path) {
        this.changed();
        const ids = path.split('.').map(x => parseInt(x, 10));
        const ring = this.coordinates[ids[0]];
        if (ring) {
            ring.splice(ids[1], 1);
            if (ring.length < 3) {
                this.coordinates.splice(ids[0], 1);
            }
        }
    }
    getCoordinate(path) {
        const ids = path.split('.').map(x => parseInt(x, 10));
        const ring = this.coordinates[ids[0]];
        return JSON.parse(JSON.stringify(ring[ids[1]]));
    }
    getCoordinates() {
        return this.coordinates.map(coords => coords.concat([coords[0]]));
    }
    updateCoordinate(path, lng, lat) {
        this.changed();
        const parts = path.split('.');
        const ringId = parseInt(parts[0], 10);
        const coordId = parseInt(parts[1], 10);
        if (coordId === 0) {
            this.center = [lng, lat];
            this.coordinates[ringId][coordId] = this.center;
        } else if (coordId === 1) {
            this.start = [lng, lat];
            this.coordinates[ringId][coordId] = this.start;
        } else if (coordId === 2) {
            let start = this.center;
            let end = this.start;
            let pos = [lng, lat];
            let bearing1 = turf.bearing(start, end);
            let bearing2 = turf.bearing(start, pos);
            let radius = turf.distance(start, end);

            const sector = turf.sector(start, radius, bearing1, bearing2).geometry.coordinates[0].slice(0, -1);
            this.coordinates = [sector];
        }

        if (this.coordinates[ringId] === undefined) {
            this.coordinates[ringId] = [];
        }
    }
}