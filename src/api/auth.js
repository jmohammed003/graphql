const AUTH_URL = "https://learn.reboot01.com/api/auth/signin";
const TOKEN_KEY = "student-profile-token";

function encodeBasic(identifier, password) {
  const bytes = new TextEncoder().encode(`${identifier}:${password}`);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export async function signIn(identifier, password) {
  let response;
  try {
    response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${encodeBasic(identifier, password)}` },
    });
  } catch {
    throw new Error("Could not reach the sign-in service. Check your connection and try again.");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("That username/email or password was not accepted.");
    }
    throw new Error(`Sign in failed (${response.status}). Please try again.`);
  }

  const token = (await response.text()).trim().replace(/^"|"$/g, "");
  if (token.split(".").length !== 3) throw new Error("The sign-in service returned an invalid session token.");
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

export function getSavedToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function signOut() {
  localStorage.removeItem(TOKEN_KEY);
}
