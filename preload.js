const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ffmpeg", {
  run: (command) => ipcRenderer.invoke("run-ffmpeg", command),
});
