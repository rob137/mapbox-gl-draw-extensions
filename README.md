### 初始化地图编辑器

```
/**
 * 初始化地图编辑器
 * @param {Object} map 必输项
 * @param {Object} options 编辑参数对象
 * @param {string} controlPosition 控件位置 非必输项 值域为 `'top-left'`, `'top-right'`, `'bottom-left'`,  `'bottom-right'`. 默认值为 `'top-right'`.
 */
var edit = new MapboxDraw.init(map, options, controlPosition);
//example
var edit = new MapboxDraw.init(map, {
            boxSelect: true,
            touchEnabled: false,
            displayControlsDefault: true,
            showButtons: false
        });

/**
 * 更换编辑参数对象
 * @param {Object} options 编辑参数对象
 */
edit = edit.setOptions(options);

/**
 * 销毁地图编辑器
 */
edit.dispose();
```

### Options 地图编辑器参数对象说明

-  keybindings, boolean (default true): 地图编辑器是否支持键盘交互.

- touchEnabled, boolean (default true): 地图编辑器是否支持触摸交互.
- boxSelect, boolean (default true): 地图编辑器是否支持数据框选，使用 shift+click+drag 进行操作.
- displayControlsDefault, boolean (default: true): 是否启用或关闭全部控件
- styles, Array\<Object>: 样式对象数组. 地图编辑器提供了默认样式.

### 地图编辑器初始化数据
 地图编辑器需要minemap loaded后才生效
```
map.on('load', function() {
  edit.draw.add(geojson);//向编辑池增加数据
  edit.setFeatures(featureCollection);//设置编辑池中的数据
});
```
### 编辑模式
编辑模式可切换不同的编辑行为
```
/**
 * 编辑模式切换触发事件
 * @param {string} mode 值域范围如下：
 * 参数说明：  'point':'画点',
               'line': '画线',
               'polygon': '画多边形',
               'rectangle': '画矩形',
               'triangle': '画三角形',
               'circle': '画圆',
               'sector': '画扇形',
               'trash': '删除所选',
               'combine': '合并同类图形',
               'uncombine': '拆分同类图形',
               'union_polygon': '合并面',
               'split_polygon': '拆分面',
               'union_line': '合并线',
               'split_line': '拆分线',
               'curve_line': '弯曲线',
               'undo': '撤销上一步操作',
               'redo': '重复上一步操作',
               'static':'切换为不可编辑模式'
 */
edit.onBtnCtrlActive(mode);
```
### API Methods
`setFeatures(featureCollection: object)`

设置编辑池中的数据，返回id数组.

示例说明:
```
var ids = edit.setFeatures(featureCollection);
```
`removeFeatures(featureIds: array)`

删除编辑池中的数据，返回id数组.

示例说明:
```
var ids = edit.removeFeatures(featureIds);
```

`setSelected(featureIds: array)`

设置地图编辑选中数据.

示例说明:
```
var ids = edit.setSelected(featureIds);
```

`setFeatureProperties(featureId: string, properties:object)`

更新feature properties，返回featureId对应的最新的feature.

示例说明:
```
edit.setFeatureProperties(featureId,{'k1':'v1','k2':'v2'});
```
`getAllHistoryRecords()`

获取编辑器中的所有操作历史记录.

示例说明:
```
var records = edit.getAllHistoryRecords();
//records为操作记录数组
//record结果说明如下：
{
  type:0,/*操作类型：0-无、1-删除、2-修改、3-新增、4-替换*/
  action:0,/*更新操作行为：0-无、1-图形移动、2-更改图形形状点、3-更改properties*/
  features:[],/*本次操作后的features*/
  prevFeatures[] /*本次操作前的features*/
}
```

`clearHistoryRecords()`
清除编辑器中所有的操作历史记录.

示例说明:

```edit.clearHistoryRecords();```

`draw.add(geojson: Object) => Array<string>`

将GeoJSON(Feature、FeatureCollection、Geometry)到添加到地图编辑器，返回新增数据的id数组，如果feature没有id，编辑器自动生成id

GeoJSON feature types 可以为: Point, LineString, Polygon, MultiPoint, MultiLineString, and MultiPolygon.

如果add() a feature(feature包含id)，该id在地图编辑器已存在, 新增的feature会替换已经存在的.

示例说明:
```
var feature = { type: 'Point', coordinates: [0, 0] };
var featureIds = edit.draw.add(feature);
console.log(featureIds);
//=> ['some-random-string']
示例说明-feature包含id:

var feature = {
  id: 'unique-id',
  type: 'Feature',
  properties: {},
  geometry: { type: 'Point', coordinates: [0, 0] }
};
var featureIds = edit.draw.add(feature);
console.log(featureIds)
//=> ['unique-id']
```

`draw.get(featureId: string): ?Feature`

根据featureId获取编辑器中的GeoJSON feature, 如果不存在则返回undefined.

示例说明:
```
var featureIds = edit.draw.add({ type: 'Point', coordinates: [0, 0] });
var pointId = featureIds[0];
console.log(edit.draw.get(pointId));
//=> { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } }
```

`draw.getFeatureIdsAt(point: { x: number, y: number }): Array<string>`

根据具体的点返回编辑器中的feature id数组.

Notice that the point argument requires x, y coordinates from pixel space, rather than longitude, latitude coordinates.
```
var featureIds = edit.draw.getFeatureIdsAt(20, 20);
console.log(featureIds)
//=> ['top-feature-at-20-20', 'another-feature-at-20-20']
```

`draw.getSelectedIds(): Array<string>`

返回编辑池中当前已选择的feature id数组.

`draw.getSelected(): FeatureCollection`

返回编辑池中当前已选择的features，以FeatureCollection的形式返回.

`draw.getSelectedPoints(): FeatureCollection`

返回编辑池中当前已选择的形状的顶点，以FeatureCollection的形式返回.

`draw.getAll(): FeatureCollection`

返回编辑池中的所有features，以FeatureCollection的形式返回.

示例说明:
```
edit.draw.add({ type: 'Point', coordinates: [0, 0] });
edit.draw.add({ type: 'Point', coordinates: [1, 1] });
edit.draw.add({ type: 'Point', coordinates: [2, 2] });
console.log(edit.draw.getAll());
// {
//   type: 'FeatureCollection',
//   features: [
//     {
//       id: 'random-0'
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [0, 0]
//       }
//     },
//     {
//       id: 'random-1'
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [1, 1]
//       }
//     },
//     {
//       id: 'random-2'
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [2, 2]
//       }
//     }
//   ]
// }
```

`draw.delete(ids: string | Array<string>)`

根据id数组删除编辑池中的数据.

示例说明:
```
var feature = { type: 'Point', coordinates: [0, 0] };
var ids = edit.draw.add(feature);
edit.draw.delete(ids).getAll();
// { type: 'FeatureCollection', features: [] }
```

`draw.deleteAll()`

删除所有编辑池中的数据.

示例说明:
```
edit.draw.add({ type: 'Point', coordinates: [0, 0] });
edit.draw.deleteAll().getAll();
// { type: 'FeatureCollection', features: [] }
```

`draw.set(featureCollection: FeatureCollection): Array<string>`

设置编辑池中的数据.

示例说明:
```
var ids = edit.draw.set({
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {},
    id: 'example-id',
    geometry: { type: 'Point', coordinates: [0, 0] }
  }]
});
// ['example-id']
```

`draw.trash()`

删除所有已选的feature或形状点的顶点.

该操作会产生历史操作记录.

### Events

`edit.record.create`

地图编辑操作记录新增事件:

当图形删除、新增、修改、属性更新、图形合并拆分等会产生新增的操作记录.
```
//加入监听
map.on("edit.record.create", onEditRecordCreate);
function onEditRecordCreate(e) {
    console.log(e.record)
}
//record结果说明如下：
{
  type:0,/*操作类型：0-无、1-删除、2-修改、3-新增、4-替换*/
  action:0,/*更新操作行为：0-无、1-图形移动、2-更改图形形状点、3-更改properties*/
  features:[],/*本次操作后的features*/
  prevFeatures[] /*本次操作前的features*/
}

```

`edit.undo`

地图编辑撤销上一步操作事件:
```
//加入监听
map.on("edit.undo", onEditUndo);
function onEditUndo(e) {
    console.log(e.record)
}
```

`edit.redo`

地图编辑重复上一步操作事件:
```
//加入监听
map.on("edit.redo", onEditRedo);
function onEditRedo(e) {
    console.log(e.record) 
}
```

`edit.selected`

地图编辑图形选中事件:
```
//加入监听
map.on("edit.selected", onEditSelected);
function onEditSelected(e) {
    console.log(e.featureIds) //e.featureIds为当前选中的图形id
}
```

`draw.update`

地图编辑feature更新事件:

```
//示例说明：
// 触发属性更新事件，然后会产出一条操作记录
map.fire('draw.update', {
                action: 'change_properties',
                prevFeatures: [旧属性的Feature],
                features: [新属性的Feature]
            })
```
