import SpotifyWebApi from 'spotify-web-api-js';
var spotifyAPI = new SpotifyWebApi();
const clientId = "b49b84a769a448bbb61de3519ed2598d"; // Replace with your client id
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const disco = "5Kmr0b3ip8g9P2i0dLTC3Z?si=oLWQmrAtTb263on3MOHLPQ";

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    //const profile = await fetchProfile(accessToken);
    //console.log("profile of: " , profile);

}

// TODO: Redirect to Spotify authorization page
export async function redirectToAuthCodeFlow(clientId: string) {
   const verifier = generateCodeVerifier(128);
   const challenge = await generateCodeChallenge(verifier);

   localStorage.setItem("verifier", verifier);

   const params = new URLSearchParams();
   params.append("client_id", clientId);
   params.append("response_type", "code");
   params.append("redirect_uri", "http://localhost:5173/callback");
   params.append("scope", "user-read-private user-read-email");
   params.append("code_challenge_method", "S256");
   params.append("code_challenge", challenge);

   document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
   let text = '';
   let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

   for (let i = 0; i < length; i++) {
       text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
}

async function generateCodeChallenge(codeVerifier: string) {
   const data = new TextEncoder().encode(codeVerifier);
   const digest = await window.crypto.subtle.digest('SHA-256', data);
   return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
       .replace(/\+/g, '-')
       .replace(/\//g, '_')
       .replace(/=+$/, '');
}


export async function getAccessToken(clientId: string, code: string) {
  // TODO: Get access token for cod
   const verifier = localStorage.getItem("verifier");

   const params = new URLSearchParams();
   params.append("client_id", clientId);
   params.append("grant_type", "authorization_code");
   params.append("code", code);
   params.append("redirect_uri", "http://localhost:5173/callback");
   params.append("code_verifier", verifier!);

   const result = await fetch("https://accounts.spotify.com/api/token", {
       method: "POST",
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
       body: params
   });
   //error logging 
   if (!result.ok) {
      throw new Error("Failed to get access token");
      //access_token = await refreshAccessToken();
   }
   try {
   const data= await result.json() as TokenResponse;
   localStorage.setItem("access_token", data.access_token);
   if (data.refresh_token) {
       localStorage.setItem("refresh_token", data.refresh_token);
   }
   return data.access_token;
} catch (error) {
   console.error(error);
   throw error;
}
}


// Function to refresh the access token using the refresh token
export async function refreshAccessToken(clientId: string, refreshToken: string): Promise<string> {
console.log("access token");
const params = new URLSearchParams();
params.append("grant_type", "refresh_token");
params.append("refresh_token", refreshToken);
params.append("client_id", clientId);

try {
   const result = await fetch("https://accounts.spotify.com/api/token", {
       method: "POST",
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
       body: params
   });

   if (!result.ok) {
       throw new Error('Failed to refresh access token');
   }
   const data = await result.json() as RefreshTokenResponse;

   localStorage.setItem("access_token", data.access_token);
   if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
   }
   return data.access_token;
} catch (error) {
   console.error('Error:', error);
   throw error;
}
}

console.log("here");