const { app, BrowserWindow, Tray, ipcMain } = require("electron");
const path = require("path");

const assetsDirectory = path.join(__dirname, "assets");

let tray = undefined;
let window = undefined;

app.dock.hide();
app.on("ready", () => {
  createTray();
  createWindow();
});

function createWindow() {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
    },
  });

  window.loadFile("index.html");
  window.on("blur", () => {
    window.hide();
  });
}

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, "spotify-logo-3.png"));
  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);
  tray.on("click", function (event) {
    toggleWindow();

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({ mode: "detach" });
    }
  });
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
};

const getWindowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

ipcMain.on("show-window", () => {
  showWindow();
});
