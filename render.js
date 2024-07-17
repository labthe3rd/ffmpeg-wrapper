let interval;

document
  .getElementById("file_convert_form")
  .addEventListener("submit", function (event) {
    //when submit is pressed we will run ffmpeg then select the download location
    event.preventDefault();
    console.log("Button pressed.");
    const fileInput = document.getElementById("fileInput");
    const fileTypeSelect = document.getElementById("filetype_select");

    // if (fileInput.files.length > 0) {
    const inputFile = fileInput.files[0].path;
    const outputExtension = fileTypeSelect.value;

    document.getElementById("spinner").style.display = "block";
    document.getElementById("timeElapsed").style.display = "block";
    let seconds = 0;
    document.getElementById("secondsElapsed").innerText = seconds;
    interval = setInterval(() => {
      seconds += 1;
      document.getElementById("secondsElapsed").innerText = seconds;
    }, 1000);

    window.ffmpeg
      .run({ inputFile, outputExtension })
      .then((outputFile) => {
        clearInterval(interval);
        document.getElementById("spinner").style.display = "none";
        document.getElementById("timeElapsed").style.display = "none";

        const link = document.createElement("a");
        link.href = `file://${outputFile}`;
        link.setAttribute("download", outputFile);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.getElementById("file_convert_form").reset();
      })
      .catch((error) => {
        clearInterval(interval);
        document.getElementById("spinner").style.display = "none";
        document.getElementById("timeElapsed").style.display = "none";
        alert("Error executing FFmpeg command.");
        console.error(error);
      });
  });
