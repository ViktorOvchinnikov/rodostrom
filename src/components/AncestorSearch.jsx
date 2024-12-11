import React, { useState } from 'react';
import './index.css';
import './result_card.css';
import './info_modal.css';


// Helper function to generate random test data
const generateRandomPeople = (count) => {
  const arr = [
    {
      name: "Ján",
      surname: "Sokol",
      role: "Šlachtic",
      gender: "male",
      matrial_status: "Manželka, 2 deti",
      birth_date: "21.6.1857",
      death_date: "1892",
      birth_city: "Smolenice",
      death_city: "Smolenice"
    },
    {
      name: "Ján",
      surname: "Sokol",
      role: "Krajčír",
      gender: "male",
      matrial_status: "Manželka",
      birth_date: "15.6.1957",
      death_date: "",
      birth_city: "Banská Bystrica",
      death_city: ""
    },
    {
      name: "Jozef",
      surname: "Sokol",
      role: "Roľník",
      gender: "male",
      matrial_status: "Manželka, 3 deti",
      birth_date: "21.6.1857",
      death_date: "1892",
      birth_city: "Banská Bystrica",
      death_city: "Smolenice"
    },
    {
      name: "Ján",
      surname: "Sokolý",
      role: "Roľník",
      gender: "male",
      matrial_status: "Slobodný",
      birth_date: "14.3.1995",
      death_date: "",
      birth_city: "Smolenice",
      death_city: ""
    },
  ];

  return arr;
};

const AncestorSearch = ({onSelect}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: 'unknown',
    birth_date: '',
    death_date: '',
    birth_city: '',
    death_city: '',
  });

  const [searchResults, setSearchResults] = useState([]);
  const [modalData, setModalData] = useState(null);
  const randomPeople = generateRandomPeople(20);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const removeDiacritics = (str) => {
    if (!str) return '';
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const results = randomPeople.filter((person) => {
      return (
        (!formData.name || removeDiacritics(person.name.toLowerCase()).includes(removeDiacritics(formData.name.toLowerCase()))) &&
        (!formData.surname || removeDiacritics(person.surname.toLowerCase()).includes(removeDiacritics(formData.surname.toLowerCase()))) &&
        (formData.gender === 'unknown' || person.gender === formData.gender) &&
        (!formData.birth_date || person.birth_date === formData.birth_date) &&
        (!formData.death_date || person.death_date === formData.death_date) &&
        (!formData.birth_city || removeDiacritics(person.birth_city.toLowerCase()).includes(removeDiacritics(formData.birth_city.toLowerCase()))) &&
        (!formData.death_city || removeDiacritics(person.death_city.toLowerCase()).includes(removeDiacritics(formData.death_city.toLowerCase())))
      );
    });
  
    setSearchResults(results);
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
        <form
          className="d-flex flex-column align-items-center justify-content-center"
          onSubmit={handleSubmit}
        >
          <fieldset className="mb-3">
            <legend>Zadanie známych údajov</legend>
            <p>Vyplnte čo najviac údajov</p>
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
      </div>

      <div id="search-results-area" className="results-area">
        {searchResults.length > 0 ? (
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
                    {result.death_date && <p>Death date: {result.death_date}</p>}
                    {result.death_city && <p>Death city: {result.death_city}</p>}
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
              {modalData.death_date && <p>Death date: {modalData.death_date}</p>}
              {modalData.death_city && <p>Death city: {modalData.death_city}</p>}
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
