import runSetup from './src/setup';
import setupOptions from './src/options';
import setupAPI from './src/api';
import Constants from './src/constants';
import modes from './src/modes';

const setupDraw = function (options, api) {
    options = setupOptions(options);

    const ctx = {
        options: options
    };

    api = setupAPI(ctx, api);
    ctx.api = api;

    const setup = runSetup(ctx);

    api.onAdd = setup.onAdd;
    api.onRemove = setup.onRemove;
    api.types = Constants.types;
    api.options = options;

    return api;
};

export {
    modes
}

export default function (options) {
    setupDraw(options, this);
};