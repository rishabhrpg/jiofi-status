const { app, Tray, Menu, BrowserWindow } = require("electron");
const path = require("path");
const request = require("request");
const open = require("openurl").open;
const parse = require("node-html-parser").parse;

const iconPath = path.join(__dirname, "icons/jio.png");
const network12 = path.join(__dirname, "icons/network12.png");
const network8 = path.join(__dirname, "icons/network8.png");
const network4 = path.join(__dirname, "icons/network4.png");
const network0 = path.join(__dirname, "icons/network0.png");

let trayApp = null;
let win = null;
let currentAppIcon = null;
const DATA_URL = "http://192.168.225.1/cgi-bin/en-jio/mStatus.html";

var updateData = function () {
  request(DATA_URL, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    var root = parse(body);

    var sinr = root.querySelector("#pDashEngineerInform_sinrValue").text;

    var signalStrength = parseFloat(sinr.replace(" dB", ""));

    if (signalStrength > 12) {
      appIcon = network12;
    } else if (signalStrength <= 12 && signalStrength > 8) {
      appIcon = network8;
    } else if (signalStrength <= 8 && signalStrength > 4) {
      appIcon = network8;
    } else if (signalStrength < 4) {
      appIcon = network0;
    }

    if (currentAppIcon != appIcon) {
      trayApp.setImage(appIcon);
      currentAppIcon = appIcon;
    }
    console.log(signalStrength);
  });
};

app.on("ready", function () {
  win = new BrowserWindow({ show: false });
  trayApp = new Tray(iconPath);
  currentAppIcon = iconPath;
  var contextMenu = Menu.buildFromTemplate([
    {
      label: "About",
      click: function () {
        open("https://github.com/rishabhrpg");
      },
    },
    {
      label: "Quit",
      click: app.quit,
    },
  ]);

  trayApp.setToolTip("Is this even visible?");
  trayApp.setContextMenu(contextMenu);

  updateData();
  setInterval(updateData, 10000);
});
