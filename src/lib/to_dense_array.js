/**
 * Derive a dense array (no `undefined`s) from a single value or array.
 *
 * @param {any} x
 * @return {Array<any>}
 */
export default function toDenseArray(x) {
    return [].concat(x).filter(y => y !== undefined);
}