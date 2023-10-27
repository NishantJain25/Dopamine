import React from "react";
import './snackbar.css'

const Snackbar = ({isSuccess, message}) => {
    return <div className="snackbar" style={{color: `${isSuccess ? "green" : "red"}`, backgroundColor: `${isSuccess ? "rgba(0,250,154,0.1)" : "rgba(255,0,0,0.1)"}`}}>
        {isSuccess ? <p className="status">Successful!</p> : <p className="status">Error!</p>}
        <p>{message}</p>
    </div>
}

export default Snackbar