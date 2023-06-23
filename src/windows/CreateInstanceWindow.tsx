import { ipcRenderer } from 'electron';
import '../static/css/CreateInstance.css';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import os from 'os';

let combinedSettings = {
  general: {
  },
  options: {
  },
  pluginsMods: {
  },
  advanced: {
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

interface CombinedFieldProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
  placeholder: string;
}

const CombinedField: React.FC<CombinedFieldProps> = ({
  options,
  onSelect,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState("");
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".combined-field")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="combined-field" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
      />

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {filteredOptions.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


function GeneralSection({ settings, setSettings }) {
  // TODO: change these to not be hardcoded of course, grab from server
  // use MCUtils beta (when it releases) to grab server software and versions
  const serverSoftware = ['Vanilla', 'Spigot', 'Paper', 'Forge', 'Fabric'];
  const versions = ['1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18', '1.17.1', '1.17', '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.16', '1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12', '1.11.2', '1.11.1', '1.11', '1.10.2', '1.10.1', '1.10', '1.9.4', '1.9.3', '1.9.2', '1.9.1', '1.9', '1.8.9'];
  const groups = ['Default', 'Group 1', 'Group 2', 'Group 3'];
  const profiles = ['No profile', 'Profile 1', 'Profile 2', 'Profile 3'];

  const changeSetting = (optionName: string, selectedOption: string) => {
    combinedSettings.general[optionName] = selectedOption;
    setSettings(combinedSettings);
  };

  const handleVersionChange = (selectedVersion: string) => {
    console.log(selectedVersion);

    const versionElements = document.querySelectorAll('.versions .versions-list .version');
    versionElements.forEach((element) => {
      if (element.textContent === selectedVersion) {
        element.classList.add('selected');
        changeSetting('version', selectedVersion);
      } else {
        element.classList.remove('selected');
      }
    });
  };

  const SliderWithTextBox = ({ settingName }) => {
    const cpuCores = os.cpus().length;
    const totalMemory = os.totalmem() / 1024 / 1024;

    const [cpuValue, setCpuValue] = useState(2);
    const [ramValue, setRamValue] = useState(2048);

    const handleSliderChange = (event) => {
      const { value } = event.target;
      if (settingName === 'CPU') {
        setCpuValue(value);
        changeSetting('cpu', value);
      } else if (settingName === 'RAM') {
        setRamValue(value);
        changeSetting('ram', value);
      }
    };

    const handleTextBoxChange = (event) => {
      const { value } = event.target;
      if (settingName === 'CPU') {
        setCpuValue(value);
        changeSetting('cpu', value);
      } else if (settingName === 'RAM') {
        setRamValue(value);
        changeSetting('ram', value);
      }
    };

    if (settingName === 'CPU') {
      return (
        <div className="sliderWithTextbox">
          <input
            type="range"
            min="1"
            max={cpuCores}
            value={cpuValue}
            onChange={handleSliderChange}
          />
          <div className="textbox">
            <input
              type="number"
              min="1"
              max={cpuCores}
              value={cpuValue}
              onChange={handleTextBoxChange}
            />
          </div>
        </div>
      );
    } else if (settingName === 'RAM') {
      return (
        <div className="sliderWithTextbox">
          <input
            type="range"
            min="512"
            max={totalMemory}
            value={ramValue}
            onChange={handleSliderChange}
          />
          <div className="textbox">
            <input
              type="number"
              min="512"
              max={totalMemory}
              value={ramValue}
              onChange={handleTextBoxChange}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="section-content">
      <div className='server-icon'>
        <img src="./static/images/question.svg" alt="instance" />
      </div>
      <div className='server-info'>
        <div className='server-name'>
          Name:
          <input type="text" placeholder="Server Name" onChange={(value) => changeSetting('name', event.target.value)} />
        </div>
        <div className='server-group'>
          in group
          <CombinedField options={groups} onSelect={(value) => (changeSetting('group', value))} placeholder='Default'></CombinedField>
        </div>
        <div className='server-profile'>
          based on
          <CombinedField options={profiles} onSelect={(value) => (changeSetting('profile', value))} placeholder='No profile'></CombinedField>
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
            <SliderWithTextBox settingName='CPU' />
          </div>
          <div className='setting'>
            <div className='allocation-settings-text'>RAM</div>
            <SliderWithTextBox settingName='RAM' />
          </div>
          <div className='setting'>
            <div className='allocation-settings-text'>Port</div>
            <div className="textbox">
              <input type="text" placeholder="25565" onChange={(value) => changeSetting('port', event.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionsSection({ settings, setSettings }) {
  // TODO: try not to hardcode all of this crap here lol
  // TODO: also have settings for other server software
  const [options, setOptions] = useState([
    { label: 'MOTD', type: 'text', value: 'A Minecraft Server' },
    { label: 'Gamemode', type: 'text', value: 'survival' },
    { label: 'Max Players', type: 'text', value: '20' },
    { label: 'Online Mode', type: 'checkbox', checked: true },
    { label: 'Server Port', type: 'text', value: 'Managed in general', disabled: true },
    { label: 'Level Seed', type: 'text', value: '' },
    { label: 'PVP', type: 'checkbox', checked: true },
    { label: 'Allow Nether', type: 'checkbox', checked: true },
    { label: 'Enable Command Block', type: 'checkbox', checked: false },
    { label: 'Level Name', type: 'text', value: 'world' },
    { label: 'Spawn Protection', type: 'text', value: '16' },
    { label: 'Spawn NPCs', type: 'checkbox', checked: true },
    { label: 'Spawn Animals', type: 'checkbox', checked: true },
    { label: 'Difficulty', type: 'text', value: 'easy' },
    { label: 'Whitelist', type: 'checkbox', checked: false },
    { label: 'Enforce Whitelist', type: 'checkbox', checked: false },
    { label: 'Enable RCON', type: 'checkbox', checked: false },
    { label: 'Generate Structures', type: 'checkbox', checked: true },
    { label: 'RCON Port', type: 'text', value: '25575' },
    { label: 'Enable Query', type: 'checkbox', checked: false },
    { label: 'Query Port', type: 'text', value: '25565' },
    { label: 'Require Resource Pack', type: 'checkbox', checked: false },
    { label: 'View Distance', type: 'text', value: '10' },
    { label: 'Allow Flight', type: 'checkbox', checked: false },
    { label: 'Enable JMX Monitoring', type: 'checkbox', checked: false },
    { label: 'Max Tick Time', type: 'text', value: '60000' },
    { label: 'Function Permission Level', type: 'text', value: '2' },
    { label: 'Generator Settings', type: 'text', value: '{}' },
    { label: 'Network Compression Threshold', type: 'text', value: '256' },
    { label: 'Sync Chunk Writes', type: 'checkbox', checked: true },
    { label: 'Enforce Secure Profile', type: 'checkbox', checked: true },
    { label: 'Resource Pack Prompt', type: 'text', value: '' },
    { label: 'Use Native Transport', type: 'checkbox', checked: true },
    { label: 'Hide Online Players', type: 'checkbox', checked: false },
    { label: 'Broadcast Console to Ops', type: 'checkbox', checked: true },
    { label: 'Hardcore', type: 'checkbox', checked: false },
    { label: 'OP Permission Level', type: 'text', value: '4' },
    { label: 'Prevent Proxy Connections', type: 'checkbox', checked: false },
    { label: 'Resource Pack', type: 'text', value: '' },
    { label: 'Simulation Distance', type: 'text', value: '10' },
    { label: 'Entity Broadcast Range Percentage', type: 'text', value: '100' },
    { label: 'Player Idle Timeout', type: 'text', value: '0' },
    { label: 'Force Gamemode', type: 'checkbox', checked: false },
    { label: 'Rate Limit', type: 'text', value: '0' },
    { label: 'Initial Enabled Packs', type: 'text', value: 'vanilla' },
    { label: 'Level Type', type: 'text', value: 'minecraft:normal' },
    { label: 'Text Filtering Config', type: 'text', value: '' },
    { label: 'Spawn Monsters', type: 'checkbox', checked: true },
    { label: 'Resource Pack SHA1', type: 'text', value: '' },
    { label: 'Max World Size', type: 'text', value: '29999984' },
  ]);


  const changeSetting = (optionName, selectedOption) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      options: {
        ...prevSettings.options,
        [optionName]: selectedOption,
      },
    }));
    combinedSettings.options[optionName] = selectedOption;
  };

  // Event handler for checkbox options
  const handleCheckboxChange = (index) => {
    const updatedOptions = [...options];
    updatedOptions[index].checked = !updatedOptions[index].checked;
    setOptions(updatedOptions);
    changeSetting(updatedOptions[index].label, updatedOptions[index].checked);
    console.log(updatedOptions[index].label + ": " + updatedOptions[index].checked);
  };

  // Event handler for text input options
  const handleTextChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].value = value;
    setOptions(updatedOptions);
    changeSetting(updatedOptions[index].label, updatedOptions[index].value);
    console.log(updatedOptions[index].label + ": " + updatedOptions[index].value);
  };

  return (
    <div className="options">
      <h2 className="options-text">Options</h2>
      <div className="options-list">
        {options.map((option, index) => (
          <div className="option" key={index}>
            <label className="option-text">
              {option.label}
            </label>
            {option.type === 'checkbox' && (
              <div className="option-switch">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleCheckboxChange(index)}
                    disabled={option.disabled}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}
            {option.type === 'text' && (
              <div className="option-input">
                <input
                  type="text"
                  value={option.value}
                  onChange={(event) => handleTextChange(index, event.target.value)}
                  disabled={option.disabled}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PluginsModsSection({ settings, changeSetting }) {
  return (
    <div className='mods'>
      <p>Coming soon!</p>
    </div>
  )
}

function AdvancedSection({ settings, changeSetting }) {
  return (
    <div className='advanced'>
      <p>Coming soon!</p>
    </div>
  )
}

function SectionBar({ activeSection, onSectionChange }) {
  const handleSectionClick = (section) => {
    console.log("Section clicked: " + section);
    onSectionChange(section);
  };

  const handleCreateClick = () => {
    // Implement your click logic here
    ipcRenderer.send('create-createInstance', combinedSettings)
    console.log('Clicked on Create');
  };

  return (
    <div className='sectionbar'>
      <div className={`section ${activeSection === 'General' ? 'active' : ''}`} onClick={() => handleSectionClick('General')}>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          General
        </div>
      </div>
      <div className={`section ${activeSection === 'Options' ? 'active' : ''}`} onClick={() => handleSectionClick('Options')}>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          Options
        </div>
      </div>
      <div className={`section ${activeSection === 'Plugins/Mods' ? 'active' : ''}`} onClick={() => handleSectionClick('Plugins/Mods')}>
        <div className='section-icon'>
          <img src="./static/images/question.svg" alt="instance" />
        </div>
        <div className='section-text'>
          Plugins/Mods
        </div>
      </div>
      <div className={`section ${activeSection === 'Advanced' ? 'active' : ''}`} onClick={() => handleSectionClick('Advanced')}>
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
            <div className="button" onClick={handleCreateClick}>
              <div className="button-icon">
                <img src={`./static/images/question.svg`} alt='question' />
              </div>
              <div className="button-text">Create</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CreateInstanceWindow = () => {
  const [activeSection, setActiveSection] = useState('General');
  const [generalSettings, setGeneralSettings] = useState({});
  const [optionsSettings, setOptionsSettings] = useState({});
  const [pluginsModsSettings, setPluginsModsSettings] = useState({});
  const [advancedSettings, setAdvancedSettings] = useState({});

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div>
      <SectionBar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div style={{ display: activeSection === 'General' ? 'block' : 'none' }}>
        <GeneralSection settings={generalSettings} setSettings={setGeneralSettings} />
      </div>
      <div style={{ display: activeSection === 'Options' ? 'block' : 'none' }}>
        <OptionsSection settings={optionsSettings} setSettings={setOptionsSettings} />
      </div>
      <div style={{ display: activeSection === 'Plugins/Mods' ? 'block' : 'none' }}>
        <PluginsModsSection settings={pluginsModsSettings} setSettings={setPluginsModsSettings} />
      </div>
      <div style={{ display: activeSection === 'Advanced' ? 'block' : 'none' }}>
        <AdvancedSection settings={advancedSettings} setSettings={setAdvancedSettings} />
      </div>
    </div>
  );
};

root.render(
  <React.StrictMode>
    <CreateInstanceWindow />
  </React.StrictMode>
)