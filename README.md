# kinect2osc-receiver

Counterpart to [Kinect2OSC](https://github.com/szymonkaliski/Kinect2OSC) OSX desktop application for receiveing pre-prepared data from Kinect via OSC.

## Installation

kinect2osc-receiver is NPM module, but currently it's only available via GitHub, fortunately you can add NPM dependencies from git:

```
npm install --save szymonkaliski/kinect2osc-receiver
```

## Usage

```javascript
var KinectReceiver = require("../index");

var port = 3333;     // osc port from Kinect2OSC
var throttle = 2000; // default is 100
var ease = 0.1;      // default is 0.2

var kinect = new KinectReceiver(port, throttle, ease);

setInterval(function() {
  console.log("CENTROIDS [" + (kinect.getCentroidsStatus() ? "dirty" : "not dirty") + "]");
  console.log(kinect.getCentroids());

  console.log("BLOBS [" + (kinect.getBlobsStatus() ? "dirty" : "not dirty") + "]");
  console.log(kinect.getBlobs());

  console.log("FLOW [" + (kinect.getFlowStatus() ? "dirty" : "not dirty") + "]");
  console.log(kinect.getFlow());
}, 1000);
```

In order to get any results, [Kinect2OSC](https://github.com/szymonkaliski/Kinect2OSC) must to be running.

