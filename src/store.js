import throttle from './lib/throttle';
import toDenseArray from './lib/to_dense_array'; // 去除Array中的undefined
import StringSet from './lib/string_set';
import render from './render';
import Constants from './constants';

const { interactions } = Constants;


function refreshSelectedCoordinates(options) {
    const newSelectedCoordinates = this._selectedCoordinates.filter(point => this._selectedFeatureIds.has(point.feature_id));
    if (this._selectedCoordinates.length !== newSelectedCoordinates.length && !options.silent) {
        this._emitSelectionChange = true;
    }
    this._selectedCoordinates = newSelectedCoordinates;
}

export default class Store {
    constructor(ctx) {
        this._features = {};
        this._featureIds = new StringSet();
        this._selectedFeatureIds = new StringSet();
        this._selectedCoordinates = [];
        this._changedFeatureIds = new StringSet(); // 用于绘制`hot feature`;
        this._deletedFeaturesToEmit = [];
        this._emitSelectionChange = false;
        this._mapInitialConfig = {};
        this.ctx = ctx;
        // hot 表示绘制过程中产生的 cold 表示绘制结束产生的。
        // 数组中结果均为geojson
        this.sources = {
            hot: [],
            cold: []
        };
        this.render = throttle(render, 16, this);
        this.isDirty = false;
    }
    // 创建 render batch,在返回的函数被调用之前，延迟渲染
    createRenderBatch() {
        const holdRender = this.render;
        let numRenders = 0;
        this.render = function () {
            numRenders++;
        };

        return () => {
            this.render = holdRender;
            if (numRenders > 0) {
                this.render();
            }
        };
    }
    /**
     * 设置 store 状态 为 `dirty`
     */
    setDirty() {
        this.isDirty = true;
        return this;
    }
    /**
     * 设置 `feature`的状态为`changed`
     * @param {string} featureId 
     */
    featureChanged(featureId) {
        this._changedFeatureIds.add(featureId);
        return this;
    }
    getChangedIds() {
        return this._changedFeatureIds.values();
    }
    clearChangedIds() {
        this._changedFeatureIds.clear();
        return this;
    }
    /**
     * 获取`store`中所有`feature`的`ids`
     */
    getAllIds() {
        return this._featureIds.values();
    }
    /**
     * 添加一个`feature`至`store`.
     * @param {Object} feature 
     */
    add(feature) {
        this.featureChanged(feature.id);
        this._features[feature.id] = feature;
        this._featureIds.add(feature.id);
        return this;
    }
    /**
     * 
     * @param {string | Array<string>} featureIds 
     * @param {Object} options 
     * @param {Object} options.silent 如果设置为true，则不会`fire`一个`event`;
     */
    delete(featureIds, options = {}) {
        toDenseArray(featureIds).forEach(id => {
            if (!this._featureIds.has(id)) return;
            this._featureIds.delete(id);
            this._selectedFeatureIds.delete(id);
            if (!options.silent) {
                if (this._deletedFeaturesToEmit.indexOf(this._features[id]) === -1) {
                    this._deletedFeaturesToEmit.push(this._features[id]);
                }
            }
            delete this._features[id];
            this.isDirty = true;
        });
        refreshSelectedCoordinates.call(this, options);
        return this;
    }
    get(id) {
        return this._features[id];
    }
    getAll() {
        return Object.keys(this._features).map(id => this._features[id]);
    }
    select(featureIds, options = {}) {
        toDenseArray(featureIds).forEach(id => {
            if (this._selectedFeatureIds.has(id)) return;
            this._selectedFeatureIds.add(id);
            this._changedFeatureIds.add(id);
            if (!options.silent) {
                this._emitSelectionChange = true;
            }
        });
        return this;
    }
    /**
     * 从当前选中的集合中删除`features`;
     * @param {string|Array<string>} featureIds 
     * @param {Object} options 
     */
    deselect(featureIds, options = {}) {
        toDenseArray(featureIds).forEach(id => {
            if (!this._selectedFeatureIds.has(id)) return;
            this._selectedFeatureIds.delete(id);
            this._changedFeatureIds.add(id);
            if (!options.silent) {
                this._emitSelectionChange = true;
            }
        });
        refreshSelectedCoordinates.call(this, options);
        return this;
    }
    clearSelected(options = {}) {
        this.deselect(this._selectedFeatureIds.values(), { silent: options.silent });
        return this;
    }
    setSelected(featureIds, options = {}) {
        featureIds = toDenseArray(featureIds);

        // Deselect any features not in the new selection
        this.deselect(this._selectedFeatureIds.values().filter(id => {
            return featureIds.indexOf(id) === -1;
        }), { silent: options.silent });

        // Select any features in the new selection that were not already selected
        this.select(featureIds.filter(id => {
            return !this._selectedFeatureIds.has(id);
        }), { silent: options.silent });

        return this;
    }
    setSelectedCoordinates(coordinates) {
        this._selectedCoordinates = coordinates;
        this._emitSelectionChange = true;
        return this;
    }
    clearSelectedCoordinates() {
        this._selectedCoordinates = [];
        this._emitSelectionChange = true;
        return this;
    }
    getSelectedIds() {
        return this._selectedFeatureIds.values();
    }
    getSelected() {
        return this._selectedFeatureIds.values().map(id => this.get(id));
    }
    getSelectedCoordinates() {
        const selected = this._selectedCoordinates.map(coordinate => {
            const feature = this.get(coordinate.feature_id);
            return {
                coordinates: feature.getCoordinate(coordinate.coord_path)
            };
        });
        return selected;
    }
    isSelected(featureId) {
        return this._selectedFeatureIds.has(featureId);
    }
    setFeatureProperty(featureId, property, value) {
        this.get(featureId).setProperty(property, value);
        this.featureChanged(featureId);
    }

    storeMapConfig() {
        interactions.forEach((interaction) => {
            const interactionSet = this.ctx.map[interaction];
            if (interactionSet) {
                this._mapInitialConfig[interaction] = this.ctx.map[interaction].isEnabled();
            }
        });
    }
    restoreMapConfig() {
        Object.keys(this._mapInitialConfig).forEach(key => {
            const value = this._mapInitialConfig[key];
            if (value) {
                this.ctx.map[key].enable();
            } else {
                this.ctx.map[key].disable();
            }
        });
    }
    getInitialConfigValue(interaction) {
        if (this._mapInitialConfig[interaction] !== undefined) {
            return this._mapInitialConfig[interaction];
        } else {
            // This needs to be set to whatever the default is for that interaction
            // It seems to be true for all cases currently, so let's send back `true`.
            return true;
        }
    }
}