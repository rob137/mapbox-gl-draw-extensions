import xtend from 'xtend';
import Constants from './constants';
import theme from './lib/theme';
import modes from './modes';

const defaultOptions = {
    defaultMode: Constants.modes.SIMPLE_SELECT,
    keybindings: true,
    touchEnabled: true,
    clickBuffer: 2,
    touchBuffer: 25,
    boxSelect: true,
    displayControlsDefault: true,
    styles: theme,
    modes: modes,
    controls: {},
    userProperties: false
};

const showControls = {
    point: true,
    line_string: true,
    polygon: true,
    trash: true,
    combine_features: true,
    uncombine_features: true,
    circle: true,
    triangle: true,
    rectangle: true,
    sector: true,
    arrow: true,
};

const hideControls = {
    point: false,
    line_string: false,
    polygon: false,
    trash: false,
    combine_features: false,
    uncombine_features: false,
    circle: false,
    triangle: false,
    rectangle: false,
    sector: false,
    arrow: false,
};

function addSources(styles, sourceBucket) {
    return styles.map(style => {
        if (style.source) return style;
        return xtend(style, {
            id: `${style.id}.${sourceBucket}`,
            source: sourceBucket === 'hot' ? Constants.sources.HOT : Constants.sources.COLD
        });
    });
}

export default function (options = {}) {
    let withDefaults = xtend(options);
    if (!options.controls) {
        withDefaults.controls = {};
    }

    if (options.displayControlsDefault === false) {
        withDefaults.controls = xtend(hideControls, options.controls);
    } else {
        withDefaults.controls = xtend(showControls, options.controls);
    }

    withDefaults = xtend(defaultOptions, withDefaults);

    // Layers with a shared source should be adjacent for performance reasons
    withDefaults.styles = addSources(withDefaults.styles, 'cold').concat(addSources(withDefaults.styles, 'hot'));

    return withDefaults;
}
