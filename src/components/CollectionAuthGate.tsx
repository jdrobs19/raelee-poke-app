import { PropsWithChildren, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { useAppState } from "../context/AppStateContext";
import { Login } from "../auth/Login";
import { Register } from "../auth/Register";

export function CollectionAuthGate({ children }: PropsWithChildren) {
  const [showRegister, setShowRegister] = useState(false);
  const { isLoggedIn, setIsLoggedIn, setUser } = useAppState();

  if (isLoggedIn) return <>{children}</>;

  const authProps = { auth, isRegistered: setIsLoggedIn, isLoggedIn: setIsLoggedIn, setUser };
  return (
    <div className="my-pokemon">
      {showRegister ? <Register {...authProps} /> : <Login {...authProps} />}
      <button type="button" onClick={() => setShowRegister((current) => !current)}>
        {showRegister ? "Back to login" : "Need an account? Register"}
      </button>
    </div>
  );
}