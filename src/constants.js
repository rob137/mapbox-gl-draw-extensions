export default {
    classes: {
        CONTROL_BASE: 'mapboxgl-ctrl',
        CONTROL_PREFIX: 'mapboxgl-ctrl-',
        CONTROL_BUTTON: 'mapbox-gl-draw_ctrl-draw-btn',
        CONTROL_BUTTON_CIRCLE: 'mapbox-gl-draw_circle',  // +
        CONTROL_BUTTON_TRIANGLE: 'mapbox-gl-draw_triangle',
        CONTROL_BUTTON_RECTANGLE: 'mapbox-gl-draw_rectangle',
        CONTROL_BUTTON_SECTOR: 'mapbox-gl-draw_sector',
        CONTROL_BUTTON_LINE: 'mapbox-gl-draw_line',
        CONTROL_BUTTON_POLYGON: 'mapbox-gl-draw_polygon',
        CONTROL_BUTTON_POINT: 'mapbox-gl-draw_point',
        CONTROL_BUTTON_TRASH: 'mapbox-gl-draw_trash',
        CONTROL_BUTTON_COMBINE_FEATURES: 'mapbox-gl-draw_combine',
        CONTROL_BUTTON_UNCOMBINE_FEATURES: 'mapbox-gl-draw_uncombine',
        CONTROL_GROUP: 'mapboxgl-ctrl-group',
        ATTRIBUTION: 'mapboxgl-ctrl-attrib',
        ACTIVE_BUTTON: 'active',
        BOX_SELECT: 'mapbox-gl-draw_boxselect'
    },
    sources: {
        HOT: 'mapbox-gl-draw-hot',
        COLD: 'mapbox-gl-draw-cold'
    },
    cursors: {
        ADD: 'add',
        MOVE: 'move',
        DRAG: 'drag',
        POINTER: 'pointer',
        NONE: 'none'
    },
    types: {
        CIRCLE: "circle",  // + 
        POLYGON: 'polygon',
        LINE: 'line_string',
        POINT: 'point',
        TRIANGLE: 'triangle',
        RECTANGLE: 'rectangle',
        SECTOR: 'sector',
    },
    geojsonTypes: {
        CIRCLE: "Circle", // + 
        TRIANGLE: 'Triangle',
        RECTANGLE: 'Rectangle',
        SECTOR: 'Sector',
        FEATURE: 'Feature',
        POLYGON: 'Polygon',
        LINE_STRING: 'LineString',
        POINT: 'Point',
        FEATURE_COLLECTION: 'FeatureCollection',
        MULTI_PREFIX: 'Multi',
        MULTI_POINT: 'MultiPoint',
        MULTI_LINE_STRING: 'MultiLineString',
        MULTI_POLYGON: 'MultiPolygon'
    },
    modes: {
        DRAW_CIRCLE: 'draw_circle', // + 
        DRAW_TRIANGLE: 'draw_triangle',
        DRAW_RECTANGLE: 'draw_rectangle',
        DRAW_SECTOR: 'draw_sector',
        DRAW_LINE_STRING: 'draw_line_string',
        DRAW_POLYGON: 'draw_polygon',
        DRAW_POINT: 'draw_point',
        SIMPLE_SELECT: 'simple_select',
        DIRECT_SELECT: 'direct_select',
        STATIC: 'static'
    },
    events: {
        CREATE: 'draw.create',
        DELETE: 'draw.delete',
        UPDATE: 'draw.update',
        SELECTION_CHANGE: 'draw.selectionchange',
        MODE_CHANGE: 'draw.modechange',
        ACTIONABLE: 'draw.actionable',
        RENDER: 'draw.render',
        COMBINE_FEATURES: 'draw.combine',
        UNCOMBINE_FEATURES: 'draw.uncombine',
        // new 
        REPLACE: 'draw.replace',
        RECORD_CREATE: 'draw.record.create',
        UNDO: 'draw.undo',
        REDO: 'draw.redo',
        SELECTED: 'draw.selected'
    },
    updateActions: {
        MOVE: 'move',
        CHANGE_COORDINATES: 'change_coordinates',
        // new
        CHANGE_PROPERTIES: 'change_properties',
    },
    meta: {
        FEATURE: 'feature',
        MIDPOINT: 'midpoint',
        VERTEX: 'vertex'
    },
    activeStates: {
        ACTIVE: 'true',
        INACTIVE: 'false'
    },
    interactions: [
        'scrollZoom',
        'boxZoom',
        'dragRotate',
        'dragPan',
        'keyboard',
        'doubleClickZoom',
        'touchZoomRotate'
    ],
    LAT_MIN: -90,
    LAT_RENDERED_MIN: -85,
    LAT_MAX: 90,
    LAT_RENDERED_MAX: 85,
    LNG_MIN: -270,
    LNG_MAX: 270
};
