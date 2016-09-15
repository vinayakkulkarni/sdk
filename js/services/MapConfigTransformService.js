/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * Transforms GXP style map config to our internal format.
 */
class MapConfigTransformService {
  transform(data) {
    var i, ii, layers = [];
    for (i = 0, ii = data.map.layers.length; i < ii; ++i) {
      var layer = data.map.layers[i];
      var source = data.sources[layer.source];
      var layerConfig = {
        properties: {
          isRemovable: true,
          visible: layer.visibility,
          title: layer.title,
          id: layer.name,
          name: layer.name
        }
      };
      if (source.ptype === 'gxp_osmsource') {
        layerConfig.type = 'Tile';
        layerConfig.source = {
          type: 'OSM'
        };
      } else if (source.ptype === 'gxp_wmscsource') {
        layerConfig.properties.popupInfo = '#AllAttributes';
        layerConfig.type = 'Tile';
        layerConfig.source = {
          type: 'TileWMS',
          properties: {
            params: {
              LAYERS: layer.name,
              STYLES: layer.styles,
              TILED: 'TRUE',
              FORMAT: layer.format,
              TRANSPARENT: layer.transparent
            },
            url: source.url
          }
        };
      } else {
        layerConfig = undefined;
      }
      if (layerConfig !== undefined) {
        layers.push(layerConfig);
      }
     }
     return {
       layers: layers,
       view: {
         center: data.map.center,
         projection: data.map.projection,
         zoom: data.map.zoom
       }
     };
  }
}

export default new MapConfigTransformService();
