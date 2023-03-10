    // More API functions here:
    // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
    
    // the link to your model provided by Teachable Machine export panel
    const URL = "https://teachablemachine.withgoogle.com/models/Kuqt40xlW/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        document.getElementById("Start").style.display = "none";
        document.getElementById("Pause").style.display = "flex";
        
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
        const detectDeviceType = () =>
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          ? 'Mobile'
          : 'Desktop';
        console.log(detectDeviceType());

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        let flip = false; // whether to flip the webcam
        if(detectDeviceType() == "Desktop"){
            flip = true;
        }
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup({ facingMode: "environment" });  // request access to the webcam
        // await webcam.setup({ deviceId: devices[0].deviceId })
        
        let isIos = false; 
        // fix when running demo in ios, video will be frozen;
        if (navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1) {
            isIos = true;
        }   

        if (isIos) {
            document.getElementById('webcam-container').appendChild(webcam.webcam);
            let wc = document.getElementsByTagName('video')[0];
            wc.setAttribute("playsinline", true); // written with "setAttribute" bc. iOS buggs otherwise :-)
            wc.muted = "true"
            wc.id = "webcamVideo";
        } else {
            document.getElementById("webcam-container").appendChild(webcam.canvas);
        }
        await webcam.play();
        window.requestAnimationFrame(loop);
        document.getElementById("Start").style.display = "flex";
    }
    
    window.onload = function() {
        camera();
        };
