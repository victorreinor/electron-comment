/* eslint-disable no-use-before-define */
const electron = require('electron');

const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
} = electron;
let mainWindow;
let commentWindow;
let commentMenu = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

function createCommentWindow() {
  commentWindow = new BrowserWindow({
    width: 500,
    height: 300,
    title: 'Novo comentário',
  });

  commentWindow.loadURL(`file://${__dirname}/comment.html`);
  // eslint-disable-next-line no-return-assign
  commentWindow.on('closed', () => commentWindow = null);

  if (process.platform !== 'darwin') {
    commentWindow.setMenu(commentMenu);
  }
}

ipcMain.on('addComment', (event, comment) => {
  mainWindow.webContents.send('addComment', comment);
  commentWindow.close();
});

//
const menuTemplate = [{
  label: 'Menu',
  submenu: [{
    label: 'Adicionar Comentário',
    click() {
      createCommentWindow();
    },
  }, {
    label: 'Sair da aplicação',
    accelerator: process.platform === 'win32' ? 'Alt+F4' : 'Cmd+Q',
    click() {
      app.quit();
    },
  }],
}];

if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
  const devTemplate = {
    label: 'Dev',
    submenu: [{
      role: 'reload',
    }, {
      label: 'Debug',
      accelerator: process.platform === 'win32' ? 'Ctrl+Shift+I' : 'Cmd+Alt+I',
      click(item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
    }],
  };

  menuTemplate.push(devTemplate);

  if (process.platform !== 'darwin') {
    commentMenu = Menu.buildFromTemplate([devTemplate]);
  }
}
