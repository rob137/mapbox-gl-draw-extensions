import runSetup from './setup';
import setupOptions from './options';
import setupAPI from './api';
import Constants from './constants';
import modes from './modes';

const setupDraw = function (options, api = {}) {
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

export default setupDraw;