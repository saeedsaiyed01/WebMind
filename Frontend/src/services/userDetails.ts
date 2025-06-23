import axios from "axios"
import { BACKEND_URL } from "../config"

export const UserDetails = async () => {
    const token = localStorage.getItem("token")
    try{
      const response = await axios.get(`${BACKEND_URL}/me`, {
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