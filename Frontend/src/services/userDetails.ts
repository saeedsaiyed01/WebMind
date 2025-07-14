import axios from "axios";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const UserDetails = async () => {
    const token = localStorage.getItem("token")
    try{
      const response = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers:{
          authorization:token
        }
      })
      if(response.status === 200){
        return response.data
      }
    }catch(err){
      console.log("error fetching user")
    }
  }