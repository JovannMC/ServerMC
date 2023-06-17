import '../static/css/CreateInstance.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import { ipcRenderer, BrowserWindow, ipcMain } from 'electron';

const root = ReactDOM.createRoot(document.getElementById('root'));

interface ButtonProps {
  text?: string;
  icon?: string;
  id?: string;
}

function Button({ text, icon, id }: ButtonProps) {
  const handleItemClick = () => {
    // Implement your click logic here
    ipcRenderer.send(text.toLowerCase() + '-createInstance')
  };
  return (
    <div className="button" id={id} onClick={handleItemClick}>
      <div className="button-icon">
        <img src={`./static/images/${icon}.svg`} alt={icon} />
      </div>
      <div className="button-text">{text}</div>
    </div>
  );
}

function Separator() {
  return <div className="separator"></div>;
}

interface SectionItemProps {
  text: string;
  icon: string;
}

function SectionItem({ text, icon }: SectionItemProps) {

  const handleItemClick = () => {
    // Implement your click logic here
    console.log('Clicked on', text);
  };

  const handleItemDoubleClick = () => {
    // Implement your double-click logic here
    console.log('Double-clicked on', text);
  };

  const handleDocumentClick = () => {
    // Implement your click logic here
  };
}

interface CombinedFieldProps {
  options: string[]; // Array of available options
  onSelect: (selectedOption: string) => void; // Callback when an option is selected
  defaultEntry: string; // Default value of the field
}

const CombinedField: React.FC<CombinedFieldProps> = ({ options, onSelect, defaultEntry }) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setShowDropdown(true);
  };

  const handleOptionSelect = (selectedOption: string) => {
    setInputValue(selectedOption);
    setShowDropdown(false);
    onSelect(selectedOption);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={defaultEntry}
        onChange={handleInputChange}
      />

      {showDropdown && (
        <div>
          {filteredOptions.map((option) => (
            <div key={option} onClick={() => handleOptionSelect(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function GeneralSection() {
  // TODO: change these to not be hardcoded of course, grab from server
  const serverSoftware = ['Vanilla', 'Spigot', 'Paper', 'Forge', 'Fabric'];
  const versions = ['1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18', '1.17.1', '1.17', '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16', '1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12', '1.11.2', '1.11.1', '1.11', '1.10.2', '1.10.1', '1.10', '1.9.4', '1.9.3', '1.9.3', '1.9.2', '1.9.1', '1.9', '1.8.9'];
  const groups = ['Default', 'Group 1', 'Group 2', 'Group 3'];
  const profiles = ['No profile', 'Profile 1', 'Profile 2', 'Profile 3'];

  const handleSelect = (selectedOption: string) => console.log(selectedOption);
  const handleVersionChange = (selectedVersion: string) => {
    console.log(selectedVersion);

    const versionElements = document.querySelectorAll('.versions .versions-list .version');
    versionElements.forEach((element) => {
      if (element.textContent === selectedVersion) {
        element.classList.add('selected');
      } else {
        element.classList.remove('selected');
      }
    });
  };


  const SliderWithTextBox = () => {
    const [value, setValue] = useState(50);

    const handleSliderChange = (event) => {
      setValue(Number(event.target.value));
    };

    const handleTextBoxChange = (event) => {
      setValue(Number(event.target.value));
    };

    return (
      <div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleSliderChange}
        />
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={handleTextBoxChange}
        />
      </div>
    );
  };

  return (
    <div className="section-content">
      <div className='server-icon'>
        <img src="./static/images/question.svg" alt="instance" />
      </div>
      <div className='server-info'>
        <div className='server-name'>
          Name:
          <input type="text" placeholder="Server Name" />
        </div>
        <div className='server-group'>
          in group
          <CombinedField options={groups} onSelect={handleSelect} defaultEntry='Default'></CombinedField>
        </div>
        <div className='server-profile'>
          based on
          <CombinedField options={profiles} onSelect={handleSelect} defaultEntry='No profile'></CombinedField>
        </div>
        <div className="server-software">
          <label htmlFor="server-software-select">Server software:</label>
          <select id="server-software-select">
            {serverSoftware.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='versions'>
        <div className='versions-text'>Versions</div>
        <ul className="versions-list">
          {versions.map((option) => (
            <li key={option} className="version" onClick={() => handleVersionChange(option)}>
              {option}
            </li>
          ))}
        </ul>
      </div>
      <div className='allocation'>
        <div className='allocation-text'>Allocation</div>
        <div className='allocation-settings'>
          <div className='setting'>
            <div className='allocation-settings-text'>CPU</div>
            <SliderWithTextBox />
          </div>
          <div className='setting'>
            <div className='allocation-settings-text'>RAM</div>
            <SliderWithTextBox />
          </div>
          <div className='setting'>
            <div className='allocation-settings-text'>Port</div>
            <input type="text" placeholder="25565" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionBar() {
  return (
    <div className='sectionbar'>
      <div className='section'>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          General
        </div>
      </div>
      <div className='section'>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          Options
        </div>
      </div>
      <div className='section'>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          Plugins/Mods
        </div>
      </div>
      <div className='section'>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          Advanced
        </div>
      </div>
      <div className='sectionbar-right'>
        <div className='instance-controls'>
          <div className='instance-control'>
            <Button text='Create' icon='question'></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateInstanceWindow() {
  return (
    <div className="App">
      <SectionBar></SectionBar>

      <GeneralSection></GeneralSection>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <CreateInstanceWindow />
  </React.StrictMode>
)