import axios from "axios";
import { encrypt } from "./Crypto";

export async function generateJwtToken() {
  try {
    const response = await axios.post(
      "http://172.16.2.38:8084/JwtService/token/generate",
      {
        client_id: encrypt("EOBS"),
        client_password: encrypt("EOBS123"),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = response.data.token;
    localStorage.setItem("jwtToken", token);
    return { token, error: null };
    
  } catch (error) {
    console.error("Error generating token:", error);
    const jwtError = error.response.data.error;
    
    return { token: null, error: jwtError };
  }
}