const { app, BrowserWindow, ipcMain } = require("electron");
const electronReload = require("electron-reload");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const debug = false;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile("index.html");
  if(debug){
    mainWindow.webContents.openDevTools();
  }
  
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("run-ffmpeg", (event, { inputFile, outputExtension }) => {
  return new Promise((resolve, reject) => {
    const outputFileName = path.join(os.tmpdir(), `output${outputExtension}`);
    const command = `ffmpeg -i "${inputFile}" "${outputFileName}" -y`;
    const process = spawn(command, { shell: true });

    process.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve(outputFileName);
      } else {
        reject(`FFmpeg command failed with code ${code}`);
      }
    });
  });
});

ipcMain.handle("save-file", (event, filePath, data) => {
  fs.writeFileSync(filePath, data);
});
