import './MainWindow.css';
import { useState, useEffect } from 'react';

function Button({ text, icon, id }) {
  return (
    <div className="button" id={id}>
      <div className="button-icon">
        <img src={`./static/images/${icon}.svg`} alt={icon} />
      </div>
      <div className="button-text">{text}</div>
    </div>
  );
}

function Separator() {
  return (
    <div className="separator"></div>
  );
}

// TODO: fix issue where after interacting with an item makes it unable to be interacted with until you click on the background
function FolderItem({ text, icon }) {
  const [isSelected, setIsSelected] = useState(false);
  var previousItem = useState(false);

  const handleItemClick = () => {
    if (document.querySelector('.folder-item.selected') == null) {
      previousItem = document.querySelector('.folder-item.selected');
    }

    if (!isSelected) {
      setIsSelected(true);
    }

    if (previousItem != null) {
      document.getElementsByClassName('folder-item selected')[0].classList.remove('selected');
      setIsSelected(true);
    }

  };

  const handleItemDoubleClick = () => {
    // Implement your double-click logic here
    console.log('Double-clicked on', text);
  };

  const handleDocumentClick = (event) => {
    if (!event.target.closest('.folder-item')) {
      setIsSelected(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div
      className={`folder-item ${isSelected ? 'selected' : ''}`}
      onClick={handleItemClick}
      onDoubleClick={handleItemDoubleClick}
    >
      <div className="folder-icon">
        <img src={`./static/images/${icon}.svg`} alt={icon} />
      </div>
      <div className="folder-name">{text}</div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div className="settingsbar">
        <Button text="Create" icon="question"></Button>
        <Separator></Separator>
        <Button text="Settings" icon="question"></Button>
        <Button text="Help" icon="question"></Button>
        <Button icon="cat" id='icon-only'></Button>
        <Button text="Manage" icon="question" id='end'></Button>
      </div>

      <div className="content">
        <div className="folder">
          <div className="folder-control">
            <img src="./static/images/uncollapse-icon.png" alt="Collapse icon" className="folder-control-icon"></img>
            <div className="folder-name">Lorem ipsum dolor sit amet</div>
          </div>
          
          <div className="folder-content">
            <FolderItem text="Minecraft SMP Server" icon="minecraft"></FolderItem>
            <FolderItem text="Lorem ipsum dolor sit amet" icon="minecraft"></FolderItem>
            <FolderItem text="some long ass server name for ellipsis lol a" icon="minecraft"></FolderItem>
            <FolderItem text="Server Name" icon="minecraft"></FolderItem>
            <FolderItem text="Server Name" icon="minecraft"></FolderItem>
            <FolderItem text="Server Name" icon="minecraft"></FolderItem>
            <FolderItem text="Server Name" icon="minecraft"></FolderItem>
          </div>
        </div>
      </div>

      <div className="infobar">
        <div className="infobar-start">
          <div className="infobar-server">
            <div className="infobar-server-icon">
              <img src="./static/images/minecraft.svg" alt="Minecraft logo"/>
            </div>
            <div className="infobar-server-info">
              <div className="infobar-server-name">Lorem ipsum dolor sit amet</div>
              <div className="infobar-server-software">Software: N/A</div>
              <div className="infobar-server-version">Version: N/A</div>
            </div>
          </div>
        </div>
        <div className="infobar-end">
          <div className="infobar-controls">
            <Button text="Start" icon="question"></Button>
            <Button text="Kill" icon="question"></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;