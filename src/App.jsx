import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    country: "",
    state: "",
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    axios
      .get("https://countriesnow.space/api/v0.1/countries")
      .then((response) => {
        setCountries(response.data.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      country: selectedCountry,
      state: "",
    }));
    setStates([]);

    if (selectedCountry) {
      axios
        .get(
          `https://countriesnow.space/api/v0.1/countries/states/q?country=${selectedCountry}`
        )
        .then((response) => {
          if (
            response.data &&
            response.data.data &&
            response.data.data.states
          ) {
            setStates(response.data.data.states);
          } else {
            setStates([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
          setStates([]);
        });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData(formData);
      setFormData({ name: "", address: "", phone: "", country: "", state: "" });
      setStates([]);
      setErrors({});
    }
  };

  return (
    <div className="container font-monospace mt-5">
      <div className="card shadow-lg p-4 mb-5 bg-white rounded">
        <h1 className="text-center text-warning fw-bold mb-4">Contact Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Name
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label fw-bold">
              Address
            </label>
            <textarea
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              id="address"
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
            ></textarea>
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label fw-bold">
              Phone Number
            </label>
            <input
              type="text"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="country" className="form-label fw-bold">
              Country
            </label>
            <select
              className={`form-select ${errors.country ? "is-invalid" : ""}`}
              id="country"
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.country} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="invalid-feedback">{errors.country}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="state" className="form-label fw-bold">
              State
            </label>
            <select
              className={`form-select ${errors.state ? "is-invalid" : ""}`}
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={states.length === 0}
            >
              <option value="">Select a state</option>
              {states.map((state) => (
                <option key={state.state_code} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <div className="invalid-feedback">{errors.state}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-outline-warning text-dark fw-bold w-100"
          >
            Submit
          </button>
        </form>
      </div>

      {submittedData && (
        <div className="card shadow-lg  p-4 mt-5 bg-light">
          <h2 className="text-success fw-bold">Submitted Data</h2>
          <p>
            <strong>Name:</strong> {submittedData.name}
          </p>
          <p>
            <strong>Address:</strong> {submittedData.address}
          </p>
          <p>
            <strong>Phone:</strong> {submittedData.phone}
          </p>
          <p>
            <strong>Country:</strong> {submittedData.country}
          </p>
          <p>
            <strong>State:</strong> {submittedData.state}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
