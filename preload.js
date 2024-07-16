const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ffmpeg", {
  run: (command) => ipcRenderer.invoke("run-ffmpeg", command),
  saveFile: (filePath, data) => ipcRenderer.invoke("save-file", filePath, data),
});
