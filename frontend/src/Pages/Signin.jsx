import React, { useState } from "react";
import InputBox from "../Components/InputBox";
import Buttons from "../Components/Buttons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heading } from "../Components/Header";
import { SubHeading } from "../Components/SubHeading";
import { BottomWarning } from "../Components/BottomWarning";

export default function Signin() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
        const requestData = {
            username: username,
            password: password,
        };

        console.log(requestData); // Log requestData to verify the username value

        const response = await axios.post(
            "http://localhost:9000/users/login",
            requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(response.data);

        localStorage.setItem("username", response.data.username);
        navigate("/dashboard");
    } catch (error) {
        setErrorMessage(error.message);
    }
};


  
  
  return (
    <div className="bg-slate-300 h-screen flex flex-col justify-center items-center">
      <div className="flex items-center justify-center h-screen">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => setUserName(e.target.value)}
            placeholder={"johnDoe@gmail.com"}
            label={"Email"}
            type={"email"}
            required
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"123xyz"}
            label={"Password"}
            type={"password"}
            required
          />
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <div className="pt-4">
            <Buttons onClick={handleSignIn} label={"SignIn"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
}
