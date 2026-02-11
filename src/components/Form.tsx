import { useState } from "react";
import Button from "./Button";
import "./Form.css";

interface Props {
  buttonText: string;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
  }) => void;
}

function Form({ buttonText, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input id="phone" type="tel" onChange={handleChange} />
      </div>

      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default Form;
