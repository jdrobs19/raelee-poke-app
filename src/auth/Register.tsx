import { AuthProps } from "../types/types";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { registerErrorNotification, registerSuccessNotification } from "../notifications";

export function Register({
  auth,
  isRegistered,
  isLoggedIn,
  setUser,
}: AuthProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          isRegistered(true);
          isLoggedIn(true);
          setUser(user.uid);
          navigate("/");
          registerSuccessNotification();
        },
      );
    } catch (error) {
      isRegistered(false);
      registerErrorNotification(error as Error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRegister();
  };

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
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
      <button type="submit">Submit</button>
    </form>
  );
}
