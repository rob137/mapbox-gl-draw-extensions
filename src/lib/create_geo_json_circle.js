export default function (coordinates, radius) {
    const degrees_between_points = 6.0;
    const number_of_points = Math.floor(360 / degrees_between_points);
    const dist_radians = radius / 6250;
    const center_lat_radians = coordinates[1] * Math.PI / 180;
    const center_lon_radians = coordinates[0] * Math.PI / 180;
    const polygon_coordinates = [];

    for (let index = 0; index < number_of_points; index++) {
        const degrees = index * degrees_between_points;
        const degree_radians = degrees * Math.PI / 180;
        const point_lat_radians = Math.asin(Math.sin(center_lat_radians) * Math.cos(dist_radians) + Math.cos(center_lat_radians) * Math.sin(dist_radians) * Math.cos(degree_radians));
        const point_lon_radians = center_lon_radians + Math.atan2(Math.sin(degree_radians) * Math.sin(dist_radians) * Math.cos(center_lat_radians), Math.cos(dist_radians) - Math.sin(center_lat_radians) * Math.sin(point_lat_radians));
        const point_lat = point_lat_radians * 180 / Math.PI;
        const point_lon = point_lon_radians * 180 / Math.PI;
        const point = [point_lon, point_lat];
        polygon_coordinates.push(point);
    }
    polygon_coordinates.push(polygon_coordinates[0]);
    return polygon_coordinates;
}