import React, { useState } from "react";
import InputBox from "../Components/InputBox";
import Buttons from "../Components/Buttons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heading } from "../Components/Header";
import { SubHeading } from "../Components/SubHeading";
import { BottomWarning } from "../Components/BottomWarning";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (response.ok) {
            // Handle successful sign-up
            console.log('Sign-up successful');
        } else {
            // Handle sign-up failure
            console.error('Sign-up failed');
        }
    } catch (error) {
        console.error('Error signing up:', error.message);
    }
};

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      {signupSuccess && <div>Account created successfully</div>}
      <div className="flex items-center justify-center h-screen">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />
          
    
          <InputBox
            onChange={(e) => setUsername(e.target.value)}
            placeholder="example@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            label={"Password"}
          />
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <div className="pt-4">
            <Buttons onClick={handleSubmit} label={"Sign up"} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/"}
          />
        </div>
      </div>
    </div>
  );
}
