import '../static/css/index.css';
import { hot } from 'react-hot-loader';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

interface ButtonProps {
    text?: string;
    icon?: string;
    id?: string;
}

function Button({ text, icon, id } : ButtonProps) {
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

function SectionItem({ text, icon } : SectionItemProps) {

    const handleItemClick = () => {
      // Implement your click logic here
  
    };
  
    const handleItemDoubleClick = () => {
      // Implement your double-click logic here
      console.log('Double-clicked on', text);
    };
  
    const handleDocumentClick = () => {
      // Implement your click logic here
    };
  }

function App() {
    return (
      <div className="App">
          <div className="infobar">
              <div className="infobar-item">
                  <div className="infobar-item-text">
                      Instance Name
                  </div>
              </div>
          </div>

          <div className="content">

          </div>

          <div className='sectionbar'>

          </div>

          <p>Test</p>
      </div>
    );
  }

export default hot(module)(App);