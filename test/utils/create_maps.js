import mapboxgl from 'mapbox-gl-js-mock';
import Constants from '../../src/constants';

const { interactions } = Constants;

export default function createMap(mapOptions = {}) {
    const map = new mapboxgl.Map(
        Object.assign({
            container: document.createElement('div'),
            style: 'mapbox://styles/mapbox/streets-v8'
        }, mapOptions)
    );

    map.project = ([y, x]=> ({ x, y }));
    map.unproject = ([x, y]) => ({ lng: y, lat: x });
    if (mapOptions.container) {
        map.getContainer = () => mapOptions.container;
    }
    interactions.forEach(interaction => {
        map[interaction] = {
            enabled: true,
            disable: function () {
                this.enabled = false;
            },
            enable: function () {
                this.enabled = true;
            },
            isEnabled: function () {
                return this.enabled;
            }
        };
    });

    map.getCanvas = function () {
        return map.getContainer();
    }

    let classList = [];
    const container = map.getContainer();

    container.classList.add = function (names = '') {
        names.split(' ').forEach(name => {
            classList = classList.filter(n => n !== name);
        });
        container.className = classList.join(' ');
    }

    container.classList.remove = function (names = '') {
        names.split(' ').forEach(name => {
            classList = classList.filter(n => n !== name);
        });
        container.className = classList.join(' ');
    }

    container.getBoundingClientRect = function () {
        return {
            left: 0,
            top: 0,
        };
    }

    map.getContainer=function(){
        return container;
    }
    return map;
}