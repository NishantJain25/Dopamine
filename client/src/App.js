import { useEffect, useRef, useState } from "react";
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
  const [url, setUrl] = useState("")
  const [snackbarInfo, setSnackbarInfo] = useState({
    isSuccess: true,
    message: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const csvRef = useRef(null)
  const exportCsv = () => {
    const headers = Object.keys(contacts[0]).slice(0,4).toString()
   

    const main = contacts.map((contact) => {
      return Object.values(contact).slice(0,4).toString()
    })

    

    const csv = [headers, ...main].join('\n')
    startCSVDownload(csv)
    
  }

  const startCSVDownload = (input) => {
    const blob = new Blob([input],{type: 'application/csv'})
    const url = URL.createObjectURL(blob)
    setUrl(url)
    csvRef?.current.click()
    setUrl("")
    URL.revokeObjectURL(url)
  }

  const onSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setIsContactsLoading(true);
    
  
    axios
      .get(`https://dopamine-test-api.vercel.app/api/contacts/search?q=${searchQuery}`)
      .then((response) => {
        console.log(response.data.contacts);
        setSearchData(prevData => [...prevData,response.data.contacts]);
        setIsContactsLoading(false)
      });

      if(!isNaN(searchQuery)){
        axios
      .get(`https://dopamine-test-api.vercel.app/api/phone/search?q=${searchQuery}`)
      .then((response) => {
        console.log(response.data.contacts);
        var contactsArray = response.data.contacts.map((contact) => contact.contact )
        console.log(contactsArray)
        setSearchData([...contactsArray]);
        setIsContactsLoading(false)
      });
      }else{
        axios
      .get(`https://dopamine-test-api.vercel.app/api/contacts/search?q=${searchQuery}`)
      .then((response) => {
        console.log(response.data.contacts);
        setSearchData(prevData => [...prevData,response.data.contacts]);
        setIsContactsLoading(false)
      });

      }
      
  };
  useEffect(() => {
    axios
      .get("https://dopamine-test-api.vercel.app/api/contacts/getAllContacts")
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
          
          {url !== "" && <a href={url} download={'test-csv.csv'} ref={csvRef}/>}
          <Link to="/contacts/add" id="add-contact-btn">
            Add New Contact
          </Link>
        </div>
        <button id="csv-btn" onClick={exportCsv}>Export to CSV</button>
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
