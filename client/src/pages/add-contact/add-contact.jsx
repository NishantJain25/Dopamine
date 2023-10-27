import React, { useEffect, useRef, useState } from "react";
import "./add-contact.css";
import { BsPerson, BsTelephone, BsFillCameraFill } from "react-icons/bs";
import Avatar from '../../assets/avatar.jpg'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProgressIndicator from "../../components/progress-indicator/progress-indicator";
import { BiTrash } from "react-icons/bi";

const AddContact = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState("Home");
  const [numberList, setNumberList] = useState([]);
  const [isImageHover, setIsImageHover] = useState(false);
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigator = useNavigate()
  const handleContactForm = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
    if (e.target.name === "number") {
      setNumber(e.target.value);
    }
    if (e.target.name === "type") {
      setType(e.target.value);
    }
  };
  
  const addNumberToList = (e) => {
    
    e.preventDefault()
    if(number.length !== 10){
      setError("Phone number should be 10 digits long")
      setTimeout(() => setError(""),3000)
      return
    }
    const newNumber = {number, type, countryCode:"+91"}
    
    if(numberList.length > 0){
      let existingNumber = numberList.find((num) => num.number === newNumber.number)
      
      if(existingNumber){
        setError("Number already added")
        setTimeout(() => setError(""), 3000)
        return
      }
    }
    setNumberList(numberList => [...numberList, newNumber])
    setNumber("")
  }

  const removeNumberFromList = (number) => {
    setNumberList(numberList => numberList.filter(num => num.number !== number.number))
  }

  const resetForm = () => {
    setName("")
    setNumber("")
    setType("")
    setImage("")
    setNumberList([])
  }
  const validateForm = () => {
    if(name === "" || numberList.length === 0){
      setError("Please enter all fields")
      setTimeout(() => setError(""),3000)
      return false
    }
    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()
   
    const isValidated = validateForm()
    if(!isValidated){
      return
    }
    
    setIsLoading(true)
    const newContact = {name,image,phones: numberList}
    console.log(newContact)
    axios.post("http://localhost:3005/api/contacts/create", newContact).then((response) => {
      console.log(response)
      if(response.data.error){
        setIsLoading(false)
        console.log(error)
        setError("Number already exists")
        setTimeout(() => setError(""),3000)
        resetForm()
        return
      }else{
        setIsLoading(false)
        resetForm()
        navigator(0)
        navigator("/")
      }
    }).catch(error => {
      console.log(error)
      setIsLoading(false)
    })
  }

  const imageInputRef = useRef()
  const convertToBase64 = (e) => {
    console.log(e)
    var reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
      console.log(reader.result)
      setImage(reader.result)
    }
    reader.onerror = (error) => {
      console.log(error)
    }
  }
  return (
    <div className="add-contact-container">
      <h1> Add New Contact</h1>
      {isLoading ? <ProgressIndicator /> :
      <div className="form-container">
        <form id="add-contact-form" onSubmit={handleSubmit}>
          <div className="image-container" onMouseEnter={() => setIsImageHover(true)} onMouseLeave={() => setIsImageHover(false)} onClick={() => imageInputRef.current.click()}>
            <input ref={imageInputRef} accept="image/*" type="file" onChange={convertToBase64} />
            <img src={image !== "" ? image : Avatar} id="contact-image"/>
            <div className="overlay" style={{opacity: `${isImageHover ? 0.1 : 0}`}}></div>
            <div id="image-icon" style={{opacity: `${isImageHover ? "1" : '0'}`, translate: `${isImageHover? "0px 0px" : "0px 10px"}`}}>
              <BsFillCameraFill />
            </div>
          </div>
          <div className="input-container">
          <span id="label">Name</span>
            <BsPerson />{" "}
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleContactForm}
            />
          </div>
          <div className="phone-number-list">
            {numberList.map((number, index) => <div className="phone-number-tile" key={index}>
              <span id="number-type">{number.type}</span>
              {number.number}
              <BiTrash style={{color: "red"}} onClick={() => removeNumberFromList(number)}/>
              </div>)}
          </div>
          <div className="input-container" id="phone-input">
          <span id="label">Phone No.</span>
            <div id="phone-input-row">
              <BsTelephone />{" "}
              <input
                type="text"
                name="number"
                value={number}
                onChange={handleContactForm}
              />
            </div>
            <div id="phone-type-row">
              <span>Type:</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </select>
            </div>
            
            <button id="add-number-btn" onClick={addNumberToList}>Add Contact</button>
          </div>
          <div className="error"><p className="error-text">{error}</p></div>
          <button id="contact-form-submit" onSubmit = {handleSubmit}>Submit</button>
        </form>
      </div>}
    </div>
  );
};

export default AddContact;
