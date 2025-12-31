import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Forms from "../components/Forms";
import { Buttons } from "../components/Button";
import emailjs from "@emailjs/browser";
import API_DOMAIN from "../config/config";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  // States for steps: 1 - Email, 2 - OTP, 3 - Profile
  const [currentStep, setCurrentStep] = useState(1);
  const [customer, setCustomer] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  // Add these to your other states in Login.jsx
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  // EmailJS config
  const SERVICE_ID = "service_0iy0ptd";
  const TEMPLATE_ID = "template_ucvqly7";
  const PUBLIC_KEY = "Z5fMeUywl9A3gBWCa";

  const navigate = useNavigate();
  const location = useLocation(); // Get location for redirect state

  // Check if already logged in on mount
  useEffect(() => {
    const customer = localStorage.getItem("customer");
    if (customer) {
      const redirectTo = location.state?.redirectTo || "/home";
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, location.state]);

  // ... existing states
  // Initialize EmailJS (do this once, e.g., in useEffect)
  React.useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      toast.error("OTP expired. Please resend."); // Using your toast setup
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  // Helper to format 300 seconds into 5:00
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

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
      alert("Please enter a valid email.");
      return;
    }

    const result = await apiCall({ action: "send_otp", email_id: email });

    if (result.head.code === 200) {
      // 1. UPDATE UI IMMEDIATELY
      toast.success("OTP sent to your email!");
      setTimeLeft(300);
      setIsTimerActive(true);
      setCurrentStep(2);

      // 2. TRIGGER EMAIL IN BACKGROUND (Remove 'await' if you don't want to wait)
      const templateParams = {
        to_email: email,
        otp: result.body.otp,
      };

      // We still use a try/catch, but it won't block the UI transition anymore
      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams).catch((error) => {
        console.error("EmailJS Error:", error);
        toast.error("Background error: Email failed to send.");
      });
    } else {
      toast.warning(result.head.msg);
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
      localStorage.setItem("customer", JSON.stringify(result.body.customer));
      toast.success("Login successful!");
      const redirectTo = location.state?.redirectTo || "/home";
      navigate(redirectTo, { replace: true });
    } else if (result.head.code === 400) {
      // NEW USER: Move to Step 3 (Profile details page)
      // toast.info("Welcome! Please complete your profile.");
      setCurrentStep(3);
    } else {
      // WRONG OTP: Show error message
      toast.error(result.head.msg || "Invalid OTP");
    }
  };

  const handleUpdateProfile = async () => {
    // 1. Validation
    if (!firstName || !lastName || !phone || !gender || !dob) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    // 2. API Call to the NEW action
    const result = await apiCall({
      action: "register_customer", // Matches the new PHP block
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      email_id: email,
      gender: gender,
      dob: dob,
    });

    if (result.head.code === 200) {
      localStorage.setItem("customer", JSON.stringify(result.body.customer));
      toast.success("Profile created! You are now signed in.");
      const redirectTo = location.state?.redirectTo || "/home";
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.head.msg);
    }
  };

  if (localStorage.getItem("customer")) {
    return null; // Or a loading spinner, but since useEffect handles it
  }

  return (
    <>
      <section className="py-5 login-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg="4" md="8">
              <div className="text-center p-4">
                {currentStep === 1 ? (
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
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      <label
                        htmlFor="consent"
                        style={{
                          fontSize: "12px",
                          color: "#555",
                          maxWidth: "300px",
                          cursor: "pointer",
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
                          disabled={!isAgreed}
                          style={{
                            backgroundColor: isAgreed ? "#ff0000" : "#cccccc",
                            color: isAgreed ? "#ffffff" : "#666666",
                            border: "none",
                            opacity: isAgreed ? 1 : 0.7,
                            cursor: isAgreed ? "pointer" : "not-allowed",
                            borderRadius: "5px",
                          }}
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
                    <div
                      className="mb-4 fw-bold text-danger"
                      style={{ fontSize: "18px" }}
                    >
                      OTP expires in: {formatTime(timeLeft)}
                    </div>

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
                        disabled={timeLeft === 0}
                      />
                    </div>

                    <p className="text-muted" style={{ fontSize: "11px" }}>
                      Didn't receive?{" "}
                      <a
                        href="#"
                        style={{
                          pointerEvents: isTimerActive ? "none" : "auto",
                          color: isTimerActive ? "#ccc" : "#007bff",
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentStep(1);
                        }}
                      >
                        {isTimerActive ? `Wait for timer to end` : "Resend OTP"}
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
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
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
