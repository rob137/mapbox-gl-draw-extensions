/**
 * 
 * @param {*} coordinates 圆心
 * @param {*} radius 半径
 * @param {*} radian 弧度
 * @param {*} offset 偏移
 * @param {*} arcPoint 扇形弧起点
 */
export default function (coordinates, radius, radian, offset, arcPoint) {
    const radianRate = radian / (2 * Math.PI);
    const degrees_between_points = 6.0
    const number_of_points = Math.floor(360 * radianRate / degrees_between_points)
    const offset_of_points = offset / degrees_between_points;
    const dist_radians = radius / 6250
    const center_lat_radians = coordinates[1] * Math.PI / 180;
    const center_lon_radians = coordinates[0] * Math.PI / 180;
    const polygon_coordinates = [];

    polygon_coordinates.push(coordinates);
    polygon_coordinates.push(arcPoint);
    for (let index = 0; index < number_of_points; index++) {
        const degrees = (index + offset_of_points) * degrees_between_points
        const degree_radians = degrees * Math.PI / 180;
        const point_lat_radians = Math.asin(Math.sin(center_lat_radians) * Math.cos(dist_radians) + Math.cos(center_lat_radians) * Math.sin(dist_radians) * Math.cos(degree_radians))
        const point_lon_radians = center_lon_radians + Math.atan2(Math.sin(degree_radians) * Math.sin(dist_radians) * Math.cos(center_lat_radians), Math.cos(dist_radians) - Math.sin(center_lat_radians) * Math.sin(point_lat_radians))
        const point_lat = point_lat_radians * 180 / Math.PI
        const point_lon = point_lon_radians * 180 / Math.PI
        const point = [point_lon, point_lat]
        polygon_coordinates.push(point)
    }
    polygon_coordinates.push(coordinates);
    return polygon_coordinates;
}