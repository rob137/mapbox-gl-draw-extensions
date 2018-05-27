import ModeInterfaceAccessors from './mode_interface_accessors';

export default class ModeInterface extends ModeInterfaceAccessors {
    onSetup() { }

    onDrag() { }

    onClick() { }

    onMouseMove() { }

    onMouseDown() { }

    onMouseUp() { }

    onMouseOut() { }

    onKeyUp() { }

    onKeyDown() { }

    onTouchStart() { }

    onTouchMove() { }

    onTouchEnd() { }

    onTap() { }

    onStop() { }

    onTrash() { }

    onCombineFeature() { }

    onUncombineFeature() { }

    toDisplayFeatures() {
        throw new Error('You must overwrite toDisplayFeatures');
    }
}