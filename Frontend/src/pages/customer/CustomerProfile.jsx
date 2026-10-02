import { useEffect, useState } from "react";

import {
  getMyCustomerProfile,
  updateMyCustomerProfile,
} from "../../services/customerService";


function CustomerProfile() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // LOAD CUSTOMER PROFILE

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setLoading(true);
        setError("");

        const customer =
          await getMyCustomerProfile();

        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.address || "",
        });

      } catch (error) {

        if (error.response?.status === 404) {

          setError(
            "Customer profile not found. Complete your details during checkout."
          );

        } else {

          setError(
            error.response?.data?.detail ||
            "Unable to load your profile."
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadProfile();

  }, []);


  // INPUT CHANGE

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));


    setSuccess("");

  };


  // UPDATE PROFILE

  const handleSubmit = async (event) => {

    event.preventDefault();


    try {

      setSaving(true);
      setError("");
      setSuccess("");


      const updatedCustomer =
        await updateMyCustomerProfile(
          formData
        );


      setFormData({
        name: updatedCustomer.name || "",
        email: updatedCustomer.email || "",
        phone: updatedCustomer.phone || "",
        address: updatedCustomer.address || "",
      });


      setSuccess(
        "Profile updated successfully."
      );


    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to update your profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // LOADING

  if (loading) {

    return (
      <div className="customer-profile-message">
        Loading your profile...
      </div>
    );

  }


  return (
    <div className="customer-profile-page">

      <div className="customer-profile-container">


        {/* HEADING */}

        <div className="customer-profile-heading">

          <p className="section-small-title">
            MY ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            View and update your customer information.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="home-error">
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="profile-success">
            {success}
          </div>
        )}


        {/* PROFILE FORM */}

        <form
          className="customer-profile-card"
          onSubmit={handleSubmit}
        >

          <div className="profile-field">

            <label htmlFor="profile-name">
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength={2}
              required
            />

          </div>


          <div className="profile-field">

            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          <div className="profile-field">

            <label htmlFor="profile-phone">
              Phone
            </label>

            <input
              id="profile-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>


          <div className="profile-field">

            <label htmlFor="profile-address">
              Address
            </label>

            <textarea
              id="profile-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              required
            />

          </div>


          <button
            type="submit"
            className="profile-save-button"
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "Save Changes"}

          </button>

        </form>

      </div>

    </div>
  );
}


export default CustomerProfile;