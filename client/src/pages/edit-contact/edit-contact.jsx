import React, { useEffect, useRef, useState } from "react";
import "./edit-contact.css";
import { BsPerson, BsTelephone, BsFillCameraFill } from "react-icons/bs";
import Avatar from '../../assets/avatar.jpg'
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProgressIndicator from "../../components/progress-indicator/progress-indicator";
import { BiTrash } from "react-icons/bi";
import Snackbar from "../../components/snackbar/snackbar";

const EditContact = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [numberList, setNumberList] = useState([]);
const [editNumberList, setEditNumberList] = useState([])
  const [isImageHover, setIsImageHover] = useState(false);
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarInfo, setSnackbarInfo] = useState({isSuccess: true, message: ""})
  const navigator = useNavigate()
  const {id} = useParams()

  useEffect(() => {
    axios.get(`http://localhost:3005/api/contacts/getContactById/${id}`).then((response) => {
        console.log(response.data)
        const {name, image, phones} = response.data.contact
        setName(name)
        setImage(image)
        setNumberList(phones)
        setEditNumberList(phones)
    })
  },[])
  const handleNumber= (e, index) => {
    console.log(e.target.name)
    if (e.target.name === "number") {
      setEditNumberList(list => list.filter((number, idx) => {if(idx === index){number.number = e.target.value}return number}));
    }
    if (e.target.name === "type") {
        setEditNumberList(list => list.filter((number, idx) => {if(idx === index){ number.type = e.target.value}return number}));
    }
  };
 
useEffect(() => {
  console.log(editNumberList)
},[editNumberList])


  const validateForm = () => {
    if(name === ""){
      setError("Name cannot be empty")
      setTimeout(() => setError(""),3000)
      return false
    }
    editNumberList.forEach(number => {
      if(number.number.length !== 10){
        setError("Number should be 10 digits long")
        setTimeout(() => setError(""),3000)
        return false
      }
    });
  return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()
   
    var isValidated = true
    console.log(isValidated)
    isValidated = validateForm()
    if(!isValidated){
      return
    }
    
    setIsLoading(true)
    const contactInfo = {_id:id,name,image}
    const updateContact = {contactInfo}
    const updatePhones = {phones: editNumberList}
    console.log("updating")
    
    axios.post("http://localhost:3005/api/phone/update", updatePhones).then((response) => {
      console.log(response)
      if(response.data.error){
        setSnackbarInfo({isSuccess: false, message: response.data.error})
        setShowSnackbar(true)
        setIsLoading(false)
        
        setTimeout(() => {      
        setShowSnackbar(false)
        },3000)}else{
          axios.post("http://localhost:3005/api/contacts/update", updateContact).then((response) => {
            console.log(response)
            if(response.data.error){
              setSnackbarInfo({isSuccess: false, message: response.data.error})
              setShowSnackbar(true)
              setIsLoading(false)
              setTimeout(() => {      
              setShowSnackbar(false)
              },3000)
          }else{
              setSnackbarInfo({isSuccess: true, message: "Contact edited."})
              setShowSnackbar(true)
              setTimeout(() => {      
              setShowSnackbar(false)
              navigator(0)
          },3000)
          
          }
          }).catch(error => {
              console.log(error)
              setSnackbarInfo({isSuccess: false, message: "could not edit contact."})
                  setShowSnackbar(true)
                  setTimeout(() => {      
                  setShowSnackbar(false)
                  setIsLoading(false)
                  },3000)
          })
        }
    }).catch(error => {
        console.log(error)
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
      <h1> Edit Contact</h1>
      {isLoading ? <ProgressIndicator /> :
      <div className="form-container">
        <form id="add-contact-form" onSubmit={handleSubmit}>
          <div className="image-container" onMouseEnter={() => setIsImageHover(true)} onMouseLeave={() => setIsImageHover(false)} onClick={() => imageInputRef.current.click()}>
          <input ref={imageInputRef} accept="image/*" type="file" onChange={convertToBase64} />
            <img src={image || Avatar} id="contact-image"/>
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="phone-number-list">
            {numberList.map((number, index) => <div className="input-container" id="phone-input">
          <span id="label">Phone No.</span>
            <div id="phone-input-row">
              <BsTelephone />{" "}
              <input
                type="text"
                name="number"
                value={editNumberList[index].number }
                onChange={(e) => handleNumber(e,index)}
              />
            </div>
            <div id="phone-type-row">
              <span>Type:</span>
              <select name="type" value={ editNumberList[index].type } onChange={(e) => handleNumber(e,index)}>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
          </div>)}
          </div>
          
          <div className="error"><p className="error-text">{error}</p></div>
          <button id="contact-form-submit" onSubmit = {handleSubmit}>Submit</button>
        </form>
      </div>}
      {showSnackbar && <Snackbar isSuccess={snackbarInfo.isSuccess} message={snackbarInfo.message}/>}
    </div>
  );
};

export default EditContact;
