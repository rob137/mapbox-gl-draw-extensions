import ModeInterface from './mode_interface';

export default function (modeObject) {
    const modeObjectKeys = Object.keys(modeObject);

    return function (ctx, startOpts = {}) {
        let state = {};
        // 累加器，为 mode 添加 ModeInterface中的接口。
        const mode = modeObjectKeys.reduce((m, k) => {
            m[k] = modeObject[k];
            return m;
        }, new ModeInterface(ctx));

        function wrapper(eh) {
            return function (e) {
                // customMode.onSetup 会返回一个`state`和`e`
                mode[eh](state, e);
            };
        }
        // 返回自定义mode的api。需要被重写。
        return {
            start: function () {
                state = mode.onSetup(startOpts); // this should set ui buttons
                this.on('drag', () => true, wrapper('onDrag'));
                this.on('click', () => true, wrapper('onClick'));
                this.on('mousemove', () => true, wrapper('onMouseMove'));
                this.on('mousedown', () => true, wrapper('onMouseDown'));
                this.on('mouseup', () => true, wrapper('onMouseUp'));
                this.on('mouseout', () => true, wrapper('onMouseOut'));
                this.on('keyup', () => true, wrapper('onKeyUp'));
                this.on('keydown', () => true, wrapper('onKeyDown'));
                this.on('touchstart', () => true, wrapper('onTouchStart'));
                this.on('touchmove', () => true, wrapper('onTouchMove'));
                this.on('touchend', () => true, wrapper('onTouchEnd'));
                this.on('tap', () => true, wrapper('onTap'));
            },
            stop: function () {
                mode.onStop(state);
            },
            trash: function () {
                mode.onTrash(state);
            },
            combineFeatures: function () {
                mode.onCombineFeatures(state);
            },
            uncombineFeatures: function () {
                mode.onUncombineFeatures(state);
            },
            render: function (geojson, push) {
                mode.toDisplayFeatures(state, geojson, push);
            }
        };
    };
}


// export default function compose(...funcs) {
//     return funcs.reduce((a, b) => (...args) => (a(b(...args))));
// }