import React, { Component } from 'react';

class Modal extends Component {
  render() {
    const { isOpen, onClose, onConfirm } = this.props;

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Logout Confirmation</h2>
          <p>Are you sure you want to log out?</p>
          <button onClick={onConfirm}>Yes, Log Out</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }
}

export default Modal;
