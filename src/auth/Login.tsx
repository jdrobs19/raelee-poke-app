import { AuthProps } from "../types/types";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./auth.css";
import {useNavigate} from "react-router-dom";
import { loginErrorNotification } from "../notifications";

export function Login({
  auth,
  isRegistered,
  isLoggedIn,
  setUser,
}: AuthProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
        await signInWithEmailAndPassword(auth, email, password).then(
            (userCredential) => {
                const user = userCredential.user;
                isRegistered(true);
                isLoggedIn(true);
                setUser(user.uid);
                navigate("/");
            } 
        )
    } catch (error) {
        isRegistered(false);
        loginErrorNotification(error as Error);
    }
  }

  return (
    <div className="auth-container">
      <h2>Login:</h2>
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
      <button onClick={handleLogin}>Submit</button>
    </div>
  );
}
