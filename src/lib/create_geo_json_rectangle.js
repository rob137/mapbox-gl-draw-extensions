export default function (start, end) {
    let rectangle_coordinates = [];
    const lt_point = [];
    const lb_point = [];
    const rt_point = [];
    const rb_point = [];

    const lt_x = start[0] <= end[0] ? start[0] : end[0];
    const lt_y = start[1] <= end[1] ? start[1] : end[1];

    const rb_x = start[0] >= end[0] ? start[0] : end[0];
    const rb_y = start[1] >= end[1] ? start[1] : end[1];

    const rt_x = rb_x;
    const rt_y = lt_y;

    const lb_x = lt_x;
    const lb_y = rb_y;

    lt_point.push(lt_x, lt_y);
    lb_point.push(lb_x, lb_y);
    rt_point.push(rt_x, rt_y);
    rb_point.push(rb_x, rb_y);
    //绘制顺序 左下 => 左上 => 右上 => 右下 => 左下
    rectangle_coordinates = [].concat([lb_point, lt_point, rt_point, rb_point, lb_point]);
    return rectangle_coordinates;
}