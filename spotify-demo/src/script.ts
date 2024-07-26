const clientId = "CLIENT_ID"; // Replace with your client id
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const disco = "5Kmr0b3ip8g9P2i0dLTC3Z?si=oLWQmrAtTb263on3MOHLPQ"
//const filename = 'artistdata.json';
if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
    const artist = await fetchArtistData(disco, accessToken);
    displayArtistData(artist); 

}

export async function redirectToAuthCodeFlow(clientId: string) {
    //Redirect to Spotify authorization page
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

export async function getAccessToken(clientId: string, code: string): Promise<string> {
   // TODO: Get access token for code
   const verifier = localStorage.getItem("verifier");

   const params = new URLSearchParams();
   params.append("client_id", clientId);
   params.append("grant_type", "authorization_code");
   params.append("code", code);
   params.append("redirect_uri", "http://localhost:5173/callback");
   params.append("code_verifier", verifier!);
try{
   const result = await fetch("https://accounts.spotify.com/api/token", {
       method: "POST",
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
       body: params
   });

   if (!result.ok) {
      throw new Error('Failed to get access token')
   }
   const data = await result.json() as TokenResponse;
   //Store tokens in local Storage or another secure location
   localStorage.setItem("access_token", data.access_token);
   if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
   } //close if 
   return data.access_token;
} catch (error) {
   console.error(error);
   throw error
}
}

export async function refreshAccessToken(clientId:string, refreshToken:string): Promise<string> {
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

    // Store the new access token and optionally a new refresh token
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



async function fetchProfile(token: string): Promise<UserProfile> {
    //Call Web API
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${token}` }
  });

  return await result.json() as UserProfile;
}

function populateUI(profile: UserProfile) {
    // Update UI with profile data
      document.getElementById("displayName")!.innerText = profile.display_name;
      if (profile.images[0]) {
          const profileImage = new Image(200, 200);
          profileImage.src = profile.images[0].url;
          document.getElementById("avatar")!.appendChild(profileImage);
      }
      document.getElementById("id")!.innerText = profile.id;
      document.getElementById("email")!.innerText = profile.email;
      document.getElementById("uri")!.innerText = profile.uri;
      document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
      document.getElementById("url")!.innerText = profile.href;
      document.getElementById("url")!.setAttribute("href", profile.href);
      document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? '(no profile image)';
}

async function fetchArtistData(artistId: string, token: string): Promise<Artist> {
   const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   });
 
   if (!response.ok) {
     throw new Error('Failed to fetch artist data');
   }
 
   return await response.json() as Artist;
 }
 
 // Display artist data in the HTML
 function displayArtistData(artist: Artist): void {
   const artistNameElement = document.getElementById('artist-name');
   const artistGenresElement = document.getElementById('artist-genres');
   const artistFollowersElement = document.getElementById('artist-followers');
   const artistImageElement = document.getElementById('artist-image') as HTMLImageElement;
 
   if (artistNameElement) artistNameElement.textContent = artist.name;
   if (artistGenresElement) artistGenresElement.textContent = artist.genres.join(', ');
   if (artistFollowersElement) artistFollowersElement.textContent = artist.followers.total.toString();
   if (artistImageElement && artist.images.length > 0) artistImageElement.src = artist.images[0].url;
 }

