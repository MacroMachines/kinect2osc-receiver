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

