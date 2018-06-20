import BezierJs from 'bezier';

//points_x为x坐标数组，points_y为y坐标数组，数组长度表示曲线的维度
export default function getBezierVertex(ctx, points_x, points_y) {
    const bezierVertex = [];

    for (let t = 0; t < 1; t += 0.01) {
        const x = BezierJs(points_x, t);
        const y = BezierJs(points_y, t);
        const lnglat = ctx.map.unproject([x, y]);
        bezierVertex.push([lnglat.lng, lnglat.lat]);
    }
    return bezierVertex;
}