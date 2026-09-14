import React from 'react';

const FormField = ({
  labelName,
  type = 'text',
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) => (
  <div className="im-field">
    <div className="im-label-row">
      <label className="im-label" htmlFor={name}>{labelName}</label>
      {isSurpriseMe && (
        <button type="button" className="im-surprise" onClick={handleSurpriseMe}>
          Surprise me
        </button>
      )}
    </div>

    <input
      className="im-input"
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      required
    />
  </div>
);

export default FormField;
