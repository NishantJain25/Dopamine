import React, { useState } from "react";
import "./phone-tile.css";
import { BsChevronDown} from "react-icons/bs";
import { BiTrash} from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PhoneTile = ({ number, length, setShowSnackbar, setSnackbarInfo }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigator = useNavigate()

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };
  const handleNumberDelete = () => {
    if(length === 1){
        console.log("last number")
        axios.post("http://localhost:3005/api/contacts/delete",{contactId: number.contact}).then((response) => {
            console.log(response)
            if(response.data.error){
                setSnackbarInfo({isSuccess: false, message: response.data.error})
                setShowSnackbar(true)
                setTimeout(() => {      
                setShowSnackbar(false)
                },3000)
            }else{
                setSnackbarInfo({isSuccess: true, message: "Contact deleted."})
                setShowSnackbar(true)
                setTimeout(() => {      
                setShowSnackbar(false)
                },3000)
                navigator("/")
                navigator(0)
            }
        }).catch(error => {
            console.log(error)
            setSnackbarInfo({isSuccess: false, message: "could not delete number."})
                setShowSnackbar(true)
                setTimeout(() => {      
                setShowSnackbar(false)
                },3000)
        })
            
        
    }else{

        axios.post("http://localhost:3005/api/phone/delete", {phoneId: number._id}).then((response) => {
            console.log(response)
            if(response.data.error){
                setSnackbarInfo({isSuccess: false, message: response.data.error})
                setShowSnackbar(true)
                setTimeout(() => {      
                setShowSnackbar(false)
                },3000)
            }else{
                setSnackbarInfo({isSuccess: true, message: "Number deleted."})
                setShowSnackbar(true)
                setTimeout(() => {      
                setShowSnackbar(false)
                navigator(0)
                },3000)
            }
        }).catch(error => {
          console.log(error)
          setSnackbarInfo({isSuccess: false, message: "could not delete number."})
              setShowSnackbar(true)
              setTimeout(() => {      
              setShowSnackbar(false)
              },3000)
      })
    }
  }
  return (
    <div id="phone-tile-container">
      <div className="phone-tile" onClick={toggleCollapse}>
        <p className="number">
          {number.countryCode} {number.number}
        </p>
        <div
          className="collapsible-section"
          style={{ height: `${isCollapsed ? "0px" : "21px"}` }}
        >
          <p>
            Type: <span>{number.type}</span>
          </p>
        </div>
        <div
          className="toggle-icon"
          style={{ rotate: `${isCollapsed ? "0deg" : "180deg"}` }}
        >
          <BsChevronDown />
        </div>
      </div>
      <BiTrash id="delete-btn" style={{color: "red", fontSize: "24px"}} onClick={handleNumberDelete}/>
    </div>
  );
};

export default PhoneTile;
