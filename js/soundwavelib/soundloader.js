var context;
var bufferLoader;

function loadSound(filename) {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../audio/' + filename,
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source1.connect(context.destination);
  source1.start(0);

}
