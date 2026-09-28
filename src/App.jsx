import { useCallback, useState } from "react";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import { getSavedToken, signIn, signOut } from "./api/auth.js";

export default function App() {
  const [token, setToken] = useState(() => getSavedToken());
  const [loginMessage, setLoginMessage] = useState("");

  async function handleSignIn(identifier, password) {
    const saved = await signIn(identifier, password);
    setLoginMessage("");
    setToken(saved);
  }

  const handleSessionExpired = useCallback(message => {
    signOut();
    setToken(null);
    setLoginMessage(message);
  }, []);

  function handleLogout() {
    signOut();
    setToken(null);
    setLoginMessage("");
  }

  return token
    ? <Profile key={token} token={token} onLogout={handleLogout} onSessionExpired={handleSessionExpired} />
    : <Login key={loginMessage} onSignIn={handleSignIn} initialMessage={loginMessage} />;
}
