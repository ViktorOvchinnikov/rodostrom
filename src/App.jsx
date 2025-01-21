import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import FamilyTree from './components/FamilyTree';
import AncestorSearch from './components/AncestorSearch';
import Communication from './components/Communication';
import SharedTrees from './components/SharedTrees';
import './styles.css';

const App = () => {
  const [modalData, setModalData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentNode, setParentNode] = useState(null);

  const navigate = useNavigate();

  const handleSearchClick = (e) => {
  if (window.location.pathname === '/search' || window.location.pathname === '/' ) {
    window.dispatchEvent(new CustomEvent('openFamilyTreeModal'));
  } else {
    e.preventDefault();
    navigate('/search', { state: { openModal: true } });
  }
  };

  return (
    <>
      <header>
        <a>
          <h1>RODOSTROM</h1>
        </a>
      </header>
      <div>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Môj rodostrom
          </NavLink>
          <NavLink to="/search" 
          onClick={handleSearchClick}
          className={({ isActive }) => (isActive ? 'active' : '')}
            >
            Vyhľadať predka
          </NavLink>
          <NavLink to="/communication" className={({ isActive }) => (isActive ? 'active' : '')}>
            Komunikácia
          </NavLink>
          <NavLink to="/shared-trees" className={({ isActive }) => (isActive ? 'active' : '')}>
            Verejné stromy
          </NavLink>
          {/*<a>Odhlásiť sa</a>*/}
        </nav>

        <Routes>
          <Route path="/" element={<FamilyTree />} />
          {/*<Route path="/search" element={<AncestorSearch />} />*/}
          <Route path="/search" element={<FamilyTree />} />
          <Route path="/communication" element={<Communication />} />
          <Route path="/shared-trees" element={<SharedTrees />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
