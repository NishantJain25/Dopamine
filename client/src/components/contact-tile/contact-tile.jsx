import React from "react";
import './contact-tile.css'

import { NavLink } from "react-router-dom";
import Avatar from '../../assets/avatar.jpg'

const ContactTile = ({contact}) => {
    return (
    <NavLink id="contact-tile-link" to={`/contacts/${contact._id}`} className={({isActive}) => isActive ? "active" : ""}>
    <div className="contact-tile">
      <div className="image-container" id="image-container-small">

    <img className="contact-image" src={contact.image || Avatar} />
      </div>
    <p className="contact-name">{contact.name}</p>
  </div>
  </NavLink>
  )
}

export default ContactTile