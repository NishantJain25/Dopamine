import React, { useEffect, useState } from "react";
import './contact-page.css'
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {Buffer} from 'buffer'
import {BiTrash} from 'react-icons/bi'
import Avatar from '../../assets/avatar.jpg'
import PhoneTile from "../../components/contact-tile/phone-tile/phone-tile";
import ProgressIndicator from "../../components/progress-indicator/progress-indicator";
import Snackbar from "../../components/snackbar/snackbar";

const ContactPage = () => {
    const [contactInfo, setContactInfo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackbarInfo, setSnackbarInfo] = useState({isSuccess: true, message: ""})
    const {id} = useParams()
    const navigator = useNavigate()
    useEffect(() => {
        setIsLoading(true)
        axios.get(`https://dopamine-test-api.vercel.app/api/contacts/getContactById/${id}`).then((response) => {
            console.log(response)
            setContactInfo(response.data.contact)
            setIsLoading(false)
        })
    },[id])

    const handleDelete = () => {
        setIsLoading(true)
        axios.post("https://dopamine-test-api.vercel.app/api/contacts/delete", {contactId: id}).then((response) => {
            setIsLoading(false)
            setSnackbarInfo({isSuccess:true,message:"Contact deleted."})
            setShowSnackbar(true)
            setTimeout(() => {
                setShowSnackbar(false)
                navigator("/")
                navigator(0)
                
            },1000)
            
        }).catch((error) => {
            console.log(error)
            setIsLoading(false)
            setSnackbarInfo({isSuccess:false,message:"Contact could not be deleted."})
            setShowSnackbar(true)
            setTimeout(() => {
                setShowSnackbar(false)
                
            },3000)
        })
    }
    return <div className="contact-page-container">

        {isLoading ? <ProgressIndicator /> : <div className="column">
            <div className="image-container" id="image-container-large">
            <img className="contact-image" id="image-large" src={contactInfo.image || Avatar} />
            </div>
            <h2 className="name">{contactInfo.name}</h2>
            <div className="action-btns">
                <NavLink to={`/contacts/edit/${id}`} className="action-btn" id="edit">Edit </NavLink>
                <button className="action-btn" id="delete"  onClick={handleDelete}>Delete <BiTrash className="action-icon"/></button>
            </div>
            <div className="phone-list">
                <h3>Phone numbers</h3>
                {contactInfo.phones.map((number) => 
                    <PhoneTile number={number} length={contactInfo.phones.length} key={number.number} setShowSnackbar={setShowSnackbar} setSnackbarInfo={setSnackbarInfo}/>
                )}
            </div>
        </div>}

        {showSnackbar && <Snackbar isSuccess={snackbarInfo.isSuccess} message={snackbarInfo.message}/>}
       
    </div>
}

export default ContactPage