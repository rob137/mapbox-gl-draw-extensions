const { access_token } = require('./config');
// const minemap = require('./mine-map/minemap');
import mapboxgl from '../node_modules/mapbox-gl';
import MapboxDraw from '../index';

// css
import './styles/mapbox-gl.css';
import '../dist/mapbox-gl-draw-extensions.css';
import './styles/index.css';

// minemap.domainUrl = '//minedata.cn';
// minemap.dataDomainUrl = '//datahive.minedata.cn';
// minemap.spriteUrl = '//minedata.cn/minemapapi/v1.3/sprite/sprite';
// minemap.serviceUrl = '//minedata.cn/service';
// //minemap.accessToken = '25cc55a69ea7422182d00d6b7c0ffa93';
// minemap.accessToken = '25cc55a66b7c0ffa93';
// minemap.solution = 2365;


// const map = new minemap.Map({
//     container: 'map',
//     style: '//minedata.cn/service/solu/style/id/2365',
//     center: [120.5445842200, 31.2961764700],
//     zoom: 14
// });
mapboxgl.accessToken = access_token;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9'
});

const customStyles = [
    // points
    {
        'id': 'highlight-active-points',
        'type': 'circle',
        'filter': ['all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['==', 'active', 'true']],
        'paint': {
            'circle-radius': 7,
            'circle-color': '#000000'
        }
    },
    {
        'id': 'points-are-blue',
        'type': 'circle',
        'filter': ['all',
            ['==', '$type', 'Point'],
            ['==', 'meta', 'feature'],
            ['==', 'active', 'false']],
        'paint': {
            'circle-radius': 5,
            'circle-color': '#000088'
        }
    },
    // ACTIVE (being drawn)
    // line stroke
    {
        'id': 'gl-draw-line',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#D20C0C',
            'line-dasharray': [0.2, 2],
            'line-width': 2
        }
    },
    // polygon fill
    {
        'id': 'gl-draw-polygon-fill',
        'type': 'fill',
        'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        'paint': {
            'fill-color': '#D20C0C',
            'fill-outline-color': '#D20C0C',
            'fill-opacity': 0.1
        }
    },
    // polygon outline stroke
    // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
    {
        'id': 'gl-draw-polygon-stroke-active',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#D20C0C',
            'line-dasharray': [0.2, 2],
            'line-width': 2
        }
    },
    // vertex point halos
    {
        'id': 'gl-draw-polygon-and-line-vertex-halo-active',
        'type': 'circle',
        'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        'paint': {
            'circle-radius': 5,
            'circle-color': '#FFF'
        }
    },
    // vertex points
    {
        'id': 'gl-draw-polygon-and-line-vertex-active',
        'type': 'circle',
        'filter': ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        'paint': {
            'circle-radius': 3,
            'circle-color': '#D20C0C',
        }
    },

    // INACTIVE (static, already drawn)
    // line stroke
    {
        'id': 'gl-draw-line-static',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'LineString'], ['==', 'mode', 'static']],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#000',
            'line-width': 3
        }
    },
    // polygon fill
    {
        'id': 'gl-draw-polygon-fill-static',
        'type': 'fill',
        'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
        'paint': {
            'fill-color': '#000',
            'fill-outline-color': '#000',
            'fill-opacity': 0.1
        }
    },
    // polygon outline
    {
        'id': 'gl-draw-polygon-stroke-static',
        'type': 'line',
        'filter': ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#000',
            'line-width': 3
        }
    }
];

const Draw = new MapboxDraw.init(map, {
    boxSelect: true,
    touchEnabled: false,
    displayControlsDefault: true,
    showButtons: true,
    styles: customStyles
});

window.map = map;
window.Draw = Draw;

// Map#addControl takes an optional second argument to set the position of the control.
// If no position is specified the control defaults to `top-right`. See the docs
// for more details: https://www.mapbox.com/mapbox-gl-js/api/map#addcontrol

// map.addControl(Draw, 'top-left');

map.on('load', function () {
    // Draw.changeMode('RotateMode');
    // Draw.changeMode('simple_select');

    // setTimeout(function () {
    //     Draw.setOptions({
    //         showButtons: false,
    //         displayControlsDefault: false
    //     });
    // }, 1000);
});

map.on('draw.click', function (e) {
    console.log(`我绘制的是一个${e.features[0].properties._type_}`, e.features);
});

map.on('draw.click', function () {
    console.log('又是特么一个事件');
});

// map.on('mouseenter', function () {
//     console.log('111');
// });
