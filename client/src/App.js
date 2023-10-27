import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ContactTile from "./components/contact-tile/contact-tile";
import { Link, Outlet } from "react-router-dom";
import ProgressIndicator from "./components/progress-indicator/progress-indicator";
import {AiOutlineClose} from 'react-icons/ai'

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isContactsLoading, setIsContactsLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState({
    isSuccess: true,
    message: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setIsContactsLoading(true);
    
    axios
      .get(`http://localhost:3005/api/contacts/search?q=${searchQuery}`)
      .then((response) => {
        console.log(response.data.contacts);
        setSearchData(prevData => [...prevData,response.data.contacts]);
        setIsContactsLoading(false)
      });

      if(!isNaN(searchQuery)){
        axios
      .get(`http://localhost:3005/api/phone/search?q=${searchQuery}`)
      .then((response) => {
        console.log(response.data.contacts);
        var contactsArray = response.data.contacts.map((contact) => contact.contact )
        console.log(contactsArray)
        setSearchData([...contactsArray]);
        setIsContactsLoading(false)
      });
      }else{
        axios
      .get(`http://localhost:3005/api/contacts/search?q=${searchQuery}`)
      .then((response) => {
        console.log(response.data.contacts);
        setSearchData(prevData => [...prevData,response.data.contacts]);
        setIsContactsLoading(false)
      });

      }
      
  };
  useEffect(() => {
    axios
      .get("http://localhost:3005/api/contacts/getAllContacts")
      .then((response) => {
        setContacts(response.data.contacts);
        setIsContactsLoading(false);
      });
  }, []);
  return (
    <div className="App">
      <div id="sidebar">
        <div className="title">
          <h1>Contacts</h1>
          <Link to="/contacts/add" id="add-contact-btn">
            Add New Contact
          </Link>
        </div>
        <div className="form-container">
          <form id="search-form" role="search">
            <input
              id="q"
              placeholder="Search"
              name="q"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button id="submit-btn" type="submit" onClick={onSearch}>
              Search
            </button>
          </form>
        </div>
        {isSearching ? (
          <div className="contacts-container">
            <div><AiOutlineClose onClick={() => setIsSearching(false)}/></div>
            <h2>Search Results:</h2>
            {isContactsLoading ? (
              <ProgressIndicator />
            ) :searchData.length === 0 ? (
              <p>No Contacts Found</p>
            ) : (
              <div className="contacts-list">
                {searchData.map((contact) => (
                  <ContactTile contact={contact} key={contact._id} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="contacts-container">
            {isContactsLoading ? (
              <ProgressIndicator />
            ) : contacts.length === 0 ? (
              <p>No contacts found</p>
            ) : (
              <div className="contacts-list">
                {contacts.map((contact) => (
                  <ContactTile contact={contact} key={contact._id} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Outlet
        setShowSnackbar={setShowSnackbar}
        setSnackbarInfo={setSnackbarInfo}
      />
    </div>
  );
}

export default App;
