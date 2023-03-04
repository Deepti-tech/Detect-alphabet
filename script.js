// More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
    
    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/Kuqt40xlW/";

    let model, webcam, labelContainer, maxPredictions;
    let isIos = false; 
    // fix when running demo in ios, video will be frozen;
    if (window.navigator.userAgent.indexOf('iPhone') > -1 || window.navigator.userAgent.indexOf('iPad') > -1) {
      isIos = true;
    }
    

    // Load the image model and setup the webcam
    async function init() {
        document.getElementById("Start").style.display = "none";
        document.getElementById("Pause").style.display = "flex";
        // const modelURL = URL + "model.json";
        // const metadataURL = URL + "metadata.json";
        // model = await tmImage.load(modelURL, metadataURL);
        
        // const devices = await navigator.mediaDevices.enumerateDevices()
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }
    async function pause(){
        document.getElementById("Pause").style.display = "none";
        document.getElementById("Play").style.display = "flex";
        webcam.pause()
    }
    async function play(){
        document.getElementById("Play").style.display = "none";
        document.getElementById("Pause").style.display = "flex";
        webcam.play()
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }

    async function camera(){
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        const flip = false; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup({ facingMode: "environment" });  // request access to the webcam
        // await webcam.setup({ deviceId: devices[0].deviceId })
        await webcam.play();
        window.requestAnimationFrame(loop);
        if (isIos) {
            document.getElementById('webcam-container').appendChild(webcam.webcam); // webcam object needs to be added in any case to make this work on iOS
            // grab video-object in any way you want and set the attributes
            const webCamVideo = document.getElementsByTagName('video')[0];
            webCamVideo.setAttribute("playsinline", true); // written with "setAttribute" bc. iOS buggs otherwise
            webCamVideo.muted = "true";
            webCamVideo.style.width = '200px';
            webCamVideo.style.height = '200px';
        } else {
            document.getElementById("webcam-container").appendChild(webcam.canvas);
        }
        // append elements to the DOM
        // document.getElementById("webcam-container").appendChild(webcam.canvas);
        
    }
    
    window.onload = function() {
        camera();
        };
