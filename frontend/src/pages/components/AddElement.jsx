import React from 'react'
import "../../assets/styles/components/AddElement.css"

function AddElement({handleClose, show, children}) {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    const handleClickOutside = (event) => {
        if (event.target.className === 'modal display-block') {
          handleClose();
        }
      };

  return (
    <>
        <div className={showHideClassName} onClick={handleClickOutside}>
            <div className="popup-main">
                {children}
            </div>
        </div>
    </>
  )
}

export default AddElement