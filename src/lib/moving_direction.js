/**
 * 判断鼠标运动方向
 *  p1 (lng1,lat1)  p2 (lng2,lat2) p3(lng3,lat3)
 *  line_p1_p2 = Ax+By+c=0
 *  A = lat2-lat1   B = lng1-lng2   C = lng2*lat1-lng1*lat2
 *  result = A*( lng3 )+B*lat3+C
 *  result < 0 在直线右侧
 *  result > 0 在直线左侧
 *  result = 0 在直线上
 * @param {*} lng1 圆心 x
 * @param {*} lat1 圆心 y
 * @param {*} lng2 起始点 x
 * @param {*} lat2 起始点 y
 * @param {*} lng3 终点 x
 * @param {*} lat3 终点 y
 */
export default function (lng1, lat1, lng2, lat2, lng3, lat3) {
    const A = lat2 - lat1;
    const B = lng1 - lng2;
    const C = lng2 * lat1 - lng1 * lat2;
    const result = A * lng3 + B * lat3 + C;
    return result;
}