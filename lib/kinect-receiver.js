var osc = require("omgosc");
var Vec2 = require("pex-geom").Vec2;
var throttle = require("lodash.throttle");

var times = function(num) {
  var arr = [], i = 0;
  for (i; i < num; ++i) { arr.push(i); }
  return arr;
};

function Kinect(port, throttle, ease) {
  this.throttle = throttle || 100;
  this.ease = ease || 0.20;
  this.receiver = new osc.UdpReceiver(port || 3333);
  this.runningReceivers = [];

  this.centroids = { positions: [], dirty: false };
  this.blobs = { positions: [], dirty: false };
  this.flow = { positions: [], dirty: false };

  this.run();
}

Kinect.prototype.throttledReceiver = function(path, callback, time) {
  this.receiver.on(path, throttle(function(event) {
    callback(event.params);
  }, time));
};

Kinect.prototype.createReceivers = function(i) {
  // receive centroids
  this.throttledReceiver("/centroid/" + i, function(params) {
    if (this.centroids.positions[i] === undefined) {
      this.centroids.positions[i] = Vec2.fromArray(params);
    }
    else {
      this.centroids.positions[i].x += (params[0] - this.centroids.positions[i].x) * this.ease;
      this.centroids.positions[i].y += (params[1] - this.centroids.positions[i].y) * this.ease;
    }

    this.centroids.dirty = true;
  }.bind(this), this.throttle);

  // receive blobs
  this.throttledReceiver("/blob/" + i, function(params) {
    this.blobs.positions[i] = params.reduce(function(memo, param, index) {
      if (index % 2 === 0) {
        memo.push(new Vec2(param, 0));
      }
      else {
        memo[memo.length - 1].y = param;
      }

      return memo;
    }, []);

    this.blobs.dirty = true;
  }.bind(this), this.throttle);

  // receive optical flow
  this.throttledReceiver("/flow/", function(params) {
    this.flow.positions = params.reduce(function(memo, param, index) {
      if (index % 2 === 0) {
        memo.push(new Vec2(param, 0));
      }
      else {
        memo[memo.length - 1].y = param;
      }

      return memo;
    }, []);

    this.flow.dirty = true;
  }.bind(this), this.throttle);
};

Kinect.prototype.run = function() {
  this.throttledReceiver("/count", function(params) {
    var count = params[0];

    // force arrays to be proper length
    [ "centroids", "blobs" ].forEach(function(key) {
      this[key].positions.splice(count, this[key].positions.length - count);
    }.bind(this));

    // dynamically create 'count' receivers
    times(count).forEach(function(i) {
      // only create receivers if needed
      if (this.runningReceivers.indexOf(i) < 0) {
        this.createReceivers(i);
        this.runningReceivers.push(i);
      }
    }.bind(this));
  }.bind(this), this.throttle);
};

Kinect.prototype.getCentroids = function() {
  this.centroids.dirty = false;
  return this.centroids.positions;
};

Kinect.prototype.getCentroidsStatus = function() {
  return this.centroids.dirty;
};

Kinect.prototype.getBlobs = function() {
  this.blobs.dirty = false;
  return this.blobs.positions;
};

Kinect.prototype.getBlobsStatus = function() {
  return this.blobs.dirty;
};

Kinect.prototype.getFlow = function() {
  this.flow.dirty = false;
  return this.flow.positions;
};

Kinect.prototype.getFlowStatus = function() {
  return this.flow.dirty;
};

module.exports = Kinect;
