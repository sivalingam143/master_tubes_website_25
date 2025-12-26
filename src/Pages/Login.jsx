import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Forms from "../components/Forms";
import { Buttons } from "../components/Button";
import emailjs from "@emailjs/browser";
import API_DOMAIN from "../config/config";

const Login = () => {
  // States for steps: 1 - Email, 2 - OTP, 3 - Profile
  const [currentStep, setCurrentStep] = useState(1);
  const [customer, setCustomer] = useState(null);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  // EmailJS config
  const SERVICE_ID = "service_plt00vs";
  const TEMPLATE_ID = "template_e203ddi";
  const PUBLIC_KEY = "alvSp_LtsfbTjDz8P";

  // Initialize EmailJS (do this once, e.g., in useEffect)
  React.useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // API call helper (assume fetch to your PHP endpoint, e.g., /api/customers.php)
  const apiCall = async (data) => {
    try {
      const response = await fetch(`${API_DOMAIN}/customer.php`, {
        // Adjust URL to your endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return { head: { code: 500, msg: "Network error" } };
    }
  };

  const handleRequestOtp = async () => {
    if (!email || !emailRegex.test(email)) {
      // Simple client validation
      alert("Please enter a valid email.");
      return;
    }

    const result = await apiCall({ action: "send_otp", email_id: email });
    if (result.head.code === 200) {
      // Send email via EmailJS
      const templateParams = {
        to_email: email,
        otp: result.body.otp, // Assuming template uses {{otp}}
        // Add other params if needed, e.g., {{to_name}}
      };
      try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        alert("OTP sent to your email!");
        setCurrentStep(2);
      } catch (error) {
        console.error("EmailJS Error:", error);
        alert("Failed to send OTP. Please try again.");
      }
    } else {
      alert(result.head.msg);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      alert("Please enter a valid 4-digit OTP.");
      return;
    }

    const result = await apiCall({
      action: "verify_otp",
      email_id: email,
      otp,
    });
    if (result.head.code === 200) {
      setCustomer(result.body.customer);
      setCurrentStep(3);
    } else {
      alert(result.head.msg);
    }
  };

  const handleUpdateProfile = async () => {
    if (!firstName || !lastName || !phone || !gender || !dob) {
      alert("Please fill all fields.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      alert("Please enter a valid DOB.");
      return;
    }

    const result = await apiCall({
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      email_id: email,
      gender,
      date_of_birth: dob, // YYYY-MM-DD format from input
      edit_customer_id: customer.customer_id,
    });
    if (result.head.code === 200) {
      alert("Profile updated successfully! You are now signed in.");
      // Redirect or handle login success, e.g., navigate to dashboard
    } else {
      alert(result.head.msg);
    }
  };

  return (
    <>
      <section className="py-5 login-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="4" md="8">
              <div className="text-center p-4">
                {currentStep === 1 ? (
                  /* --- SCREEN 1: EMAIL INPUT --- */
                  <>
                    <h3 className="body-font fw-bold mb-2">Login With OTP</h3>
                    <p className="title-font text-muted mb-4">
                      Please enter your email address
                    </p>

                    <div className="mb-3">
                      <Forms
                        PlaceHolder="Please Enter Your Email ID"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="d-flex align-items-start mb-4 text-start justify-content-center">
                      <input
                        type="checkbox"
                        id="consent"
                        className="mt-1 me-2"
                      />
                      <label
                        htmlFor="consent"
                        style={{
                          fontSize: "12px",
                          color: "#555",
                          maxWidth: "300px",
                        }}
                      >
                        I agree to receive updates and offers from
                        mastertubes.com via Email.
                      </label>
                    </div>

                    <div className="d-flex justify-content-center mb-3">
                      <div style={{ width: "40%" }}>
                        <Buttons
                          label="Request OTP"
                          className="w-100 py-2"
                          onClick={handleRequestOtp}
                        />
                      </div>
                    </div>

                    <p className="text-muted" style={{ fontSize: "11px" }}>
                      A 4 digit OTP will be sent to your email address
                    </p>
                  </>
                ) : currentStep === 2 ? (
                  /* --- SCREEN 2: OTP INPUT --- */
                  <>
                    <h3 className="body-font fw-bold mb-4">Enter OTP</h3>
                    <p className="title-font text-muted mb-4">
                      We sent a 4-digit code to {email}
                    </p>

                    <div className="mb-3">
                      <Forms
                        PlaceHolder="Enter 4-digit OTP"
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={4}
                      />
                    </div>

                    <div className="d-flex justify-content-center mb-3">
                      <Buttons
                        label="Verify OTP"
                        className="w-100 py-2"
                        onClick={handleVerifyOtp}
                      />
                    </div>

                    <p className="text-muted" style={{ fontSize: "11px" }}>
                      Didn't receive?{" "}
                      <a href="#" onClick={() => setCurrentStep(1)}>
                        Resend OTP
                      </a>
                    </p>
                  </>
                ) : (
                  /* --- SCREEN 3: PROFILE DETAILS --- */
                  <>
                    <p className="title-font mb-1" style={{ fontSize: "14px" }}>
                      Hello! we just need a few more details
                    </p>
                    <h3 className="body-font fw-bold mb-4">Profile Details</h3>

                    <div className="mb-3 text-start">
                      <label
                        className="fw-bold mb-1"
                        style={{ fontSize: "13px" }}
                      >
                        First name
                      </label>
                      <Forms
                        PlaceHolder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label
                        className="fw-bold mb-1"
                        style={{ fontSize: "13px" }}
                      >
                        Last name
                      </label>
                      <Forms
                        PlaceHolder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label
                        className="fw-bold mb-1"
                        style={{ fontSize: "13px" }}
                      >
                        Phone number
                      </label>
                      <Forms
                        PlaceHolder="Enter 10-digit phone number"
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ""))
                        }
                        maxLength={10}
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label
                        className="fw-bold mb-1"
                        style={{ fontSize: "13px" }}
                      >
                        Email
                      </label>
                      <Forms
                        PlaceHolder="Email"
                        type="email"
                        value={email}
                        readOnly={true}
                      />
                    </div>

                    <div className="mb-3 text-start">
                      <label
                        className="fw-bold mb-1"
                        style={{ fontSize: "13px" }}
                      >
                        Gender
                      </label>
                      <select
                        className="form-control"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    <div className="mb-4 text-start">
                      <label
                        className="fw-bold mb-1"
                        style={{ fontSize: "13px" }}
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>

                    <div className="d-flex justify-content-center">
                      <Buttons
                        label="Update and sign-in"
                        className="px-5 py-2"
                        style={{
                          backgroundColor: "#ff4d6d",
                          border: "none",
                          color: "white",
                          borderRadius: "5px",
                        }}
                        onClick={handleUpdateProfile}
                      />
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Login;
