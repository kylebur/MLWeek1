const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');
let net;


async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  await setupWebcam();

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = classId => {
    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(webcamElement, 'conv_preds');

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);
  };

  // When clicking a button, add an example for that class.
  document.getElementById('class-rock').addEventListener('click', () => addExample(0));
  document.getElementById('class-paper').addEventListener('click', () => addExample(1));
  document.getElementById('class-scissors').addEventListener('click', () => addExample(2));
  document.getElementById('class-lizard').addEventListener('click', () => addExample(3));
  document.getElementById('class-spock').addEventListener('click', () => addExample(4));
  document.getElementById('class-dog').addEventListener('click', () => addExample(5));
  document.getElementById('class-bomb').addEventListener('click', () => addExample(6));
  document.getElementById('class-bronto').addEventListener('click', () => addExample(7));
  document.getElementById('class-spider').addEventListener('click', () => addExample(8));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['Rock', 'Paper', 'Scissors', 'Lizard', 'Spock', 'Dog', 'Bomb', 'Bronto', 'Spider'];
      const winners = ['Paper', 'Scissors', 'Dog', 'Rock', 'Paper', 'Spock', 'scissors', 'Spider', 'Rock'];
      document.getElementById('console').innerText = `
	Here is what I would have chosen if I had hands: ${winners[result.classIndex]}\n 
        I think your move was: ${classes[result.classIndex]}\n
        with the probability: ${result.confidences[result.classIndex]}
	Result:  I win.  Sorry.
      `;
    }

    await tf.nextFrame();
  }
}

async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
        navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
        navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true},
        stream => {
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata',  () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

app();
