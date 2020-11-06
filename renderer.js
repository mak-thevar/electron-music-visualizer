// In the renderer process.
const { desktopCapturer } = require('electron')

desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    console.log(sources);
  for (const source of sources) {
    if (source.name === "Entire Screen") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
            }
          },
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        })
        handleStream(stream)
      } catch (e) {
        handleError(e)
      }
      return
    }
  }
})
var audioStream = null;
function handleStream (stream) {
  // const video = document.querySelector('video')
  // video.volume = 0;
  // video.srcObject = stream
  // video.onloadedmetadata = (e) => video.play()
  audioStream = stream;
    setTimeout(()=>{
      var context = new AudioContext;
      var analyser = context.createMediaStreamSource(stream);
      var data = context.createAnalyser();
      analyser.connect(data);
      let m = new main(data);
      m.start();
    },2000);

}

function handleError (e) {
  console.log(e)
}
