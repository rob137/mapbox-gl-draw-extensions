const modes = [
    'simple_select',
    'direct_select',
    'draw_point',
    'draw_polygon',
    'draw_line_string',
    'draw_circle',
    'draw_triangle',
    'draw_rectangle',
    'draw_sector',
    'draw_arrow'
];

export default modes.reduce((m, k) => {
    m[k] = require(`./${k}`).default;
    return m;
}, {});
