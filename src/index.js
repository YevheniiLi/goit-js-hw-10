import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import  Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
  }
  
  refs.searchInput.addEventListener('input', debounce(searchInbox, DEBOUNCE_DELAY));
  
  function searchInbox() {
    const searchValue = refs.searchInput.value.trim().toLowerCase();
  

    if (searchValue) {
      fetchCountries(searchValue)
        .then(checkInputResult)
        .catch(error => {
         Notiflix.Notify.failure('Oops, there is no country with that name');
          cleanInputResult();
        });
    }
  
    if (searchValue.length === 0) {
        cleanInputResult();
    }
  };
  
  function checkInputResult(countryArray) {
         if (countryArray.length > 10) {
      Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      return;
    }
        if (countryArray.length === 1) {
            countryInfoBox(countryArray[0]);
      refs.countryList.innerHTML = '';
      return;
    } else {
        countryMarkup(countryArray);
      refs.countryInfo.innerHTML = '';
      return;
    }
  };
  
  function countryInfoBox(country) {
    
        const countryInfoValues =
         `<h2 class="country-title"><img src=${country.flags.svg} 
         alt="flag of ${country.name.official} 
         class="flag-icon flag-icon-large" width="100" /> 
         ${country.name.official
      }</h2>
    <p class="capital"><b>Capital: </b>${country.capital}</p>
    <p class="population"><b>Population: </b>${country.population}</p>
    <p class="languages"><b>Languages: </b>${Object.values(country.languages).join(', ')}</p >`;
    
    
    refs.countryInfo.innerHTML = countryInfoValues;
    
  };
  
  function countryMarkup(countryItem) {
    const countryMarkupValues = countryItem.map(({ flags: { svg }, name: { official } }) => {
      return `<li class="list-item">
        <img class="mini-icon" 
        src="${svg}" 
        alt="${official} 
        flag" width="45" height="30"/>
        ${official}
      </li>`
    }).join('');
    refs.countryList.innerHTML = countryMarkupValues;
  }
    
  function cleanInputResult() {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
  }
  
  