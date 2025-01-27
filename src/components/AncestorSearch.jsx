import React, { useState } from 'react';
import './index.css';
import './result_card.css';
import './info_modal.css';


// Helper function to generate random test data
const generateRandomPeople = (count) => {
  const arr = [
    {
      name: "Ján",
      surname: "Minulý",
      job: "Šľachtic",
      gender: "male",
      matrial_status: "Ženatý/Vydatá, 2 deti",
      born: "21.6.1877",
      died: "1892",
      born_at: "Smolenice",
      died_at: "Smolenice"
    },
    {
      name: "Ján",
      surname: "Minulý",
      job: "Krajčír",
      gender: "male",
      matrial_status: "Ženatý/Vydatá",
      born: "15.6.1957",
      died: "",
      born_at: "Banská Bystrica",
      died_at: ""
    },
    {
      name: "Jozef",
      surname: "Minulý",
      job: "Roľník",
      gender: "male",
      matrial_status: "Ženatý/Vydatá, 3 deti",
      born: "21.6.1857",
      died: "1892",
      born_at: "Banská Bystrica",
      died_at: "Smolenice"
    },
    {
      name: "Ján",
      surname: "Milený",
      job: "Roľník",
      gender: "male",
      matrial_status: "Slobodný/á",
      born: "14.3.1995",
      died: "",
      born_at: "Smolenice",
      died_at: ""
    },
  ];

  return arr;
};

const AncestorSearch = ({onSelect,addAncestorNode}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: 'unknown',
    birth_date: '',
    death_date: '',
    birth_city: '',
    death_city: '',
    job: '',
    spouse: '',
    children: '',
    wedding_date: '',
    batpism_date: '',
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [modalData, setModalData] = useState(null);
  const randomPeople = generateRandomPeople(20);
  
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
	// Clear data
    setFormData({
      name: '',
      surname: '',
      gender: 'unknown',
      birth_date: '',
      death_date: '',
      birth_city: '',
      death_city: '',
      job: '',
      spouse: '',
      children: '',
      wedding_date: '',
      batpism_date: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddAncestor = (data) => {
    addAncestorNode(data);
  };

  const removeDiacritics = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[̀-\u036f]/g, '');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Simulate search delay
    setTimeout(() => {
      const results = randomPeople.filter((person) => {
        return (
          (!formData.name || removeDiacritics(person.name.toLowerCase()).includes(removeDiacritics(formData.name.toLowerCase()))) &&
          (!formData.surname || removeDiacritics(person.surname.toLowerCase()).includes(removeDiacritics(formData.surname.toLowerCase()))) &&
          (formData.gender === 'unknown' || person.gender === formData.gender) &&
          (!formData.birth_date || person.born === formData.birth_date) &&
          (!formData.death_date || person.died === formData.death_date) &&
          (!formData.birth_city || removeDiacritics(person.born_at.toLowerCase()).includes(removeDiacritics(formData.birth_city.toLowerCase()))) &&
          (!formData.death_city || removeDiacritics(person.died_at.toLowerCase()).includes(removeDiacritics(formData.death_city.toLowerCase()))) &&
          (!formData.job || removeDiacritics(person.job.toLowerCase()).includes(removeDiacritics(formData.job.toLowerCase())))
        );
      });
      setSearchResults(results);
      setLoading(false); // Stop loading
    }, 4000); // Simulate 4 seconds of loading
  };


  const openModal = (result) => {
    console.log(result);
    setModalData(result);
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <section className="container d-flex">
      <div id="search-form-area" className="form-area">
	  
	  {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('basic')}
        >
          Vyhľadávanie
        </button>
        <button
          className={`tab-button ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => handleTabSwitch('advanced')}
        >
          Rozšírené vyhľadávanie
        </button>
      </div>
	  
	  
	  {/* Tab Content */}
	  
	  {activeTab === 'basic' && (
        <form
          className="d-flex flex-column align-items-center justify-content-center"
          onSubmit={handleSubmit}
        >
          <fieldset className="mb-3">
            <legend>Zadanie známych údajov</legend>
            <p>Vyplňte čo najviac údajov</p>
            <p>Môžete zadať aj nepresné informácie</p>
            <table>
			<tr>
              <td align="right"><label htmlFor="name">Meno:</label></td>
               <input
                type="text"
                name="name"
                id="name"
                size="20"
                value={formData.name}
                onChange={handleChange}
              />
            </tr>
            <tr>
               <td align="right"><label htmlFor="surname">Priezvisko:</label></td>
              <input
                type="text"
                name="surname"
                id="surname"
                size="20"
                value={formData.surname}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="gender">Pohlavie:</label></td>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="unknown">Neznáme</option>
                <option value="male">Muž</option>
                <option value="female">Žena</option>
                <option value="other">Iné</option>
              </select>
            </tr>
            <tr>
              <td align="right"><label htmlFor="birth_date">Dátum narodenia:</label></td>
              <input
                type="date"
                name="birth_date"
                id="birth_date"
                size="20"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="death_date">Dátum úmrtia:</label></td>
              <input
                type="date"
                name="death_date"
                id="death_date"
                size="20"
                value={formData.death_date}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="birth_city">Miesto narodenia:</label></td>
              <input
                type="text"
                name="birth_city"
                id="birth_city"
                size="20"
                value={formData.birth_city}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="death_city">Miesto úmrtia:</label></td>
              <input
                type="text"
                name="death_city"
                id="death_city"
                size="20"
                value={formData.death_city}
                onChange={handleChange}
              />
            </tr>
			
			</table>
          </fieldset>
          <p>
            <input type="submit" name="search" id="search" value="VYHĽADAŤ" />
          </p>
        </form>
	  )}
	  
	  
	  {activeTab === 'advanced' && (
	          <form
          className="d-flex flex-column align-items-center justify-content-center"
          onSubmit={handleSubmit}
        >
		          <fieldset className="mb-3">
            <legend>Zadanie známych údajov</legend>
            <p>Vyplňte čo najviac údajov</p>
            <p>Môžete zadať aj nepresné informácie</p>
            <table>
			<tr>
              <td align="right"><label htmlFor="name">Meno:</label></td>
               <input
                type="text"
                name="name"
                id="name"
                size="20"
                value={formData.name}
                onChange={handleChange}
              />
            </tr>
            <tr>
               <td align="right"><label htmlFor="surname">Priezvisko:</label></td>
              <input
                type="text"
                name="surname"
                id="surname"
                size="20"
                value={formData.surname}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="gender">Pohlavie:</label></td>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="unknown">Neznáme</option>
                <option value="male">Muž</option>
                <option value="female">Žena</option>
                <option value="other">Iné</option>
              </select>
            </tr>
            <tr>
              <td align="right"><label htmlFor="birth_date">Dátum narodenia:</label></td>
              <input
                type="date"
                name="birth_date"
                id="birth_date"
                size="20"
                value={formData.birth_date}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="death_date">Dátum úmrtia:</label></td>
              <input
                type="date"
                name="death_date"
                id="death_date"
                size="20"
                value={formData.death_date}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="birth_city">Miesto narodenia:</label></td>
              <input
                type="text"
                name="birth_city"
                id="birth_city"
                size="20"
                value={formData.birth_city}
                onChange={handleChange}
              />
            </tr>
            <tr>
              <td align="right"><label htmlFor="death_city">Miesto úmrtia:</label></td>
              <input
                type="text"
                name="death_city"
                id="death_city"
                size="20"
                value={formData.death_city}
                onChange={handleChange}
              />
            </tr>
			<tr>
              <td align="right"><label htmlFor="spouse">Manžel-ka:</label></td>
              <input
                type="text"
                name="spouse"
                id="spouse"
                size="20"
                value={formData.spouse}
                onChange={handleChange}
              />
            </tr>
			<tr>
              <td align="right"><label htmlFor="children">Deti:</label></td>
              <input
                type="text"
                name="children"
                id="children"
                size="20"
                value={formData.children}
                onChange={handleChange}
              />
            </tr>
			<tr>
              <td align="right"><label htmlFor="job">Povolanie:</label></td>
              <input
                type="text"
                name="job"
                id="job"
                size="20"
                value={formData.job}
                onChange={handleChange}
              />
            </tr>
			<tr>
              <td align="right"><label htmlFor="wedding_date">Dátum svadby:</label></td>
              <input
                type="date"
                name="wedding_date"
                id="wedding_date"
                size="20"
                value={formData.wedding_date}
                onChange={handleChange}
              />
            </tr>
			            <tr>
              <td align="right"><label htmlFor="baptism_date">Dátum krstenia:</label></td>
              <input
                type="date"
                name="baptism_date"
                id="baptism_date"
                size="20"
                value={formData.baptism_date}
                onChange={handleChange}
              />
            </tr>
			
			</table>
          </fieldset>
		  
          <p>
            <input type="submit" name="search" id="search" value="VYHĽADAŤ" />
          </p>
        </form>
	  
	  )}
		
		
		
      </div>

      <div id="search-results-area" className="results-area">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>
              Vyhľadávanie predka {formData.name} {formData.surname}...
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <h2>Výsledky vyhľadávania</h2>
            <div className="results-container">
              {searchResults.map((result) => (
                <div key={result.id} className="result-card">
                  <div className="result-left">
                    <div className="icon-circle" onClick={() => openModal(result)}>i</div>
                  </div>
                  <div className="result-center">
                    <h3>{result.name} {result.surname}</h3>
                    <p>{result.role}</p>
                    <p>{result.matrial_status}</p>
                    {result.death_date && <p>Dátum úmrtia: {result.death_date}</p>}
                    {result.death_city && <p>Miesto úmrtia: {result.death_city}</p>}
                  </div>
                  <div className="result-right">
                    <button
                      className="add-button"
                      onClick={() => onSelect(result)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>Zatiaľ žiadne výsledky</p>
          </div>
        )}
      </div>

      {modalData && (
        <div className={`modal ${modalData ? 'show' : ''}`} onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
			<p></p>
            <div className="profile-picture"></div>
            <div className="profile-info">
              <h3>{modalData.name} {modalData.surname}</h3>
              <p>{modalData.role}</p>
              <p>{modalData.matrial_status}</p>
              <p>{modalData.birth_date}</p>
              <p>{modalData.birth_city}</p>
              {modalData.death_date && <p>Dátum úmrtia: {modalData.death_date}</p>}
              {modalData.death_city && <p>Miesto úmrtia: {modalData.death_city}</p>}
            </div>
            <div className="modal-footer">
              <button className="add-ancestor-button" onClick={() => onSelect(modalData)}>
                Pridať predka
              </button>
            </div>
			<p></p>
          </div>
        </div>
      )}
    </section>
  );
};

export default AncestorSearch;
