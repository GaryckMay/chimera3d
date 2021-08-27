'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    } else {
        factory(window.L);
    }
}(this, function (L) {
    L.Canvas.include({
        _updateImg(layer) {
            const { img } = layer.options;
            const p = layer._point.round(),
            p2 = layer._bounce[1].round();
                var cvsSrc = document.createElement('canvas');
                var ctxSrc = cvsSrc.getContext('2d');
                cvsSrc.width = img.imageData.width;
                cvsSrc.height = img.imageData.height;
                ctxSrc.putImageData(img.imageData, 0, 0);
                this._ctx.drawImage(cvsSrc,p.x,p.y,p2.x-p.x,p2.y-p.y)
        },
    });


    const defaultImgOptions = {
        size: [10, 10],
    };

    const CanvasMarker = L.CircleMarker.extend({
        _updatePath() {
            if (!this.options.img || !this.options.img.imageData) return;
            this._renderer._updateImg(this);
        },
        _project: function () {
            var lng = this._latlng.lng,
                lat = this._latlng.lat,
                lng2 = this.options.bounce[1][1],
                lat2 = this.options.bounce[1][0],
                map = this._map;

                var top = map.project([lat , lng]),
                    bottom = map.project([lat , lng]),
                    p = top.add(bottom).divideBy(2);
                var top2 = map.project([lat2 , lng2]),
                    bottom2 = map.project([lat2 , lng2]),
                    p2 = top2.add(bottom2).divideBy(2);

                this._point = p.subtract(map.getPixelOrigin());
                this._bounce = [this._point,p2.subtract(map.getPixelOrigin())]
                this._radius = 0;
                this._radiusY = 0;


            this._updateBounds();
        }
    });

    L.canvasMarker = function (...opt) {
        try {
            const i = opt.findIndex(o => typeof o === 'object' && o.img);
            if (i+1) {
                if (opt[i].pane) delete opt[i].pane;
                opt[i].bounce=opt[0]
                opt[0]=opt[0][0]
            }
        } catch(e) {}
        return new CanvasMarker(...opt);
    };
}));