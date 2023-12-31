import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import fs from "fs";
import path from "path";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const CREATE_INSTANCE_WINDOW_WEBPACK_ENTRY: string;
declare const CREATE_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Declare browser windows
let mainWindow: BrowserWindow;
let createInstanceWindow: BrowserWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Create main window
const createWindow = () => {
  mainWindow = new BrowserWindow({
    title: "ServerMC",
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

ipcMain.on("create-window", () => {
  console.log("ipc received: create-window");
  createInstanceWindow = new BrowserWindow({
    title: "Create Instance",
    width: 700,
    height: 600,
    webPreferences: {
      preload: CREATE_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Remove menu
  createInstanceWindow.removeMenu();

  // Load html
  createInstanceWindow.loadURL(CREATE_INSTANCE_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (isDev) {
    createInstanceWindow.webContents.openDevTools();
  }
});

// Listen for instance creation
ipcMain.on("create-createInstance", (event, data) => {
  console.log("ipc received: create-createInstance");
  console.log(data);

  const serverName = data["general"]["name"];
  const serverPath = path.join(".", "servers", serverName);
  const serverSettings = JSON.stringify(data, null, 2);
  const servermcCfgPath = path.join(serverPath, "servermc.cfg");
  const serverPropertiesFilePath = path.join(serverPath, "server.properties");
  const defaultServerPropertiesFilePath = path.join(
    __dirname,
    "static",
    "configs",
    "server.properties"
  );

  // Create server folder
  fs.mkdirSync(serverPath, { recursive: true });

  // Create servermc.cfg
  fs.writeFile(servermcCfgPath, serverSettings, (err) => {
    if (err) {
      console.error("Error writing servermc.cfg:", err);
    } else {
      console.log("servermc.cfg written successfully!");
    }
  });

  // Create server.properties
  fs.writeFile(
    serverPropertiesFilePath,
    defaultServerPropertiesFilePath,
    (err) => {
      if (err) {
        console.error("Error writing server.properties:", err);
      } else {
        console.log("server.properties written successfully!");
      }
    }
  );

  // Create eula.txt
  fs.writeFile(path.join(serverPath, "eula.txt"), "eula=true", (err) => {
    if (err) {
      console.error("Error writing eula.txt:", err);
    } else {
      console.log("eula.txt written successfully!");
    }
  });

  // Helper function to convert settings object to properties string
  function convertToPropertiesString(settings) {
    let propertiesString = "";
    for (const key in settings) {
      const value = settings[key];
      const formattedKey = key.toLowerCase().replace(/ /g, "-"); // Convert key to lowercase and replace spaces with dashes
      if (typeof value === "object") {
        // Handle object properties
        propertiesString += `${formattedKey}\n`;
        for (const subKey in value) {
          propertiesString += `  ${subKey}=${value[subKey]}\n`;
        }
      } else {
        // Handle other properties
        propertiesString += `${formattedKey}=${value}\n`;
      }
    }
    return propertiesString;
  }

  // Helper function to parse properties file into an object
  function parsePropertiesFile(fileContent) {
    const properties = {};
    if (!fileContent) {
      console.error("Empty file content");
      return properties;
    }
    const lines = fileContent.split("\n");
    for (const line of lines) {
      if (line && line.trim() !== "" && !line.startsWith("#")) {
        const [key, value] = line.split("=");
        if (!key || !value) {
          console.error("Invalid line:", line);
          continue;
        }
        const formattedKey = key.toLowerCase().replace(/-/g, " "); // Convert key to lowercase and replace dashes with spaces
        properties[formattedKey.trim()] = value.trim();
      }
    }
    return properties;
  }

  // Read the contents of the default server.properties file
  fs.readFile(
    defaultServerPropertiesFilePath,
    "utf8",
    (err, defaultFileContent) => {
      if (err) {
        console.error("Error reading default server.properties file:", err);
        return;
      }

      console.log("Default File Content:", defaultFileContent); // Log the default file content

      // Read the contents of the existing server.properties file
      fs.readFile(
        serverPropertiesFilePath,
        "utf8",
        (err, existingFileContent) => {
          if (err) {
            console.error("Error reading server.properties file:", err);
            return;
          }

          console.log("Existing File Content:", existingFileContent); // Log the existing file content

          // Parse the contents into objects
          const existingSettings = parsePropertiesFile(existingFileContent);
          const defaultSettings = parsePropertiesFile(defaultFileContent);

          // Extract the "options" section from the data object
          const options = data["options"];

          // Merge the options with the existing settings
          // NOTE: Minecraft overwrites the existing keys with the new settings when the server.properties file is loaded, so no need to replace the existing keys
          const mergedSettings = {
            ...defaultSettings,
            ...existingSettings,
            ...options,
          };

          // Convert the merged settings back to a string
          const settingsText = convertToPropertiesString(mergedSettings);

          console.log("Merged Settings:", mergedSettings); // Log the merged settings

          // Write the updated settings to the server.properties file
          fs.writeFile(serverPropertiesFilePath, settingsText, (err) => {
            if (err) {
              console.error("Error writing to server.properties file:", err);
            } else {
              console.log("server.properties file updated successfully!");
            }
          });
        }
      );
    }
  );

  //createInstanceWindow.close();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
