interface UserProfile {
   country: string;
   display_name: string;
   email: string;
   explicit_content: {
       filter_enabled: boolean,
       filter_locked: boolean
   },
   external_urls: { spotify: string; };
   followers: { href: string; total: number; };
   href: string;
   id: string;
   images: Image[];
   product: string;
   type: string;
   uri: string;
}

interface Image {
   url: string;
   height: number;
   width: number;
}

interface Artist {
   name: string;
   genres: string[];
   followers: {total:number};
   images: {url:string}[];
}

interface FilePath {
   file: string;
}
interface TokenResponse {
   access_token: string;
   token_type: string;
   expires_in: number;
   refresh_token?: string;
}

interface RefreshTokenResponse {
   access_token: string;
   token_type: string;
   expires_in: number;
   refresh_token?: string;
}