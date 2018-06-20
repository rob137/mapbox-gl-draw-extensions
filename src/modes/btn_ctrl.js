import constants from '../constants';

export default function btn_ctrl(ctx, mode) {
    switch (mode) {
        case 'point':
            ctx.draw.changeMode(constants.modes.DRAW_POINT);
            break;
        case 'line':
            ctx.draw.changeMode(constants.modes.DRAW_LINE_STRING);
            break;
        case 'polygon':
            ctx.draw.changeMode(constants.modes.DRAW_POLYGON);
            break;
        case 'rectangle':
            ctx.draw.changeMode(constants.modes.DRAW_RECTANGLE);
            break;
        case 'triangle':
            ctx.draw.changeMode(constants.modes.DRAW_TRIANGLE);
            break;
        case 'circle':
            ctx.draw.changeMode(constants.modes.DRAW_CIRCLE);
            break;
        case 'sector':
            ctx.draw.changeMode(constants.modes.DRAW_SECTOR);
            break;
        case 'trash':
            ctx.draw.trash();
            break;
        case 'combine':
            ctx.draw.combineFeatures();
            break;
        case 'uncombine':
            ctx.draw.uncombineFeatures();
            break;
        case 'union_polygon':
            ctx.draw.unionPolygon();
            break;
        case 'split_polygon':
            ctx.draw.changeMode(constants.modes.SPLIT_POLYGON);
            break;
        case 'union_line':
            ctx.draw.unionLine();
            break;
        case 'split_line':
            ctx.draw.splitLine();
            break;
        case 'curve_line':
            ctx.draw.curveLine();
            break;
        case 'undo':
            ctx.undoOperation();
            break;
        case 'redo':
            ctx.redoOperation();
            break;
        case 'static':
            ctx.draw.changeMode(constants.modes.STATIC);
            break;
        default:
            break;
    }
}
