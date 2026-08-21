import { AuthProps } from "../types/types";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./auth.css";
import { useNavigate } from "react-router-dom";

export function Register({
  auth,
  isRegistered,
  isLoggedIn,
  setUser,
}: AuthProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleRegister = async() => {
    try {
        await createUserWithEmailAndPassword(auth, email, password).then(
            (userCredential) => {
                const user = userCredential.user;
                isRegistered(true);
                isLoggedIn(true);
                setUser(user.email ?? "");
                navigate("/");
            } 
        )
    } catch (error) {
        isRegistered(false);
    }
  }

  return (
    <div className="auth-container">
      <h2>Register:</h2>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={handleRegister}>Submit</button>
    </div>
  );
}
