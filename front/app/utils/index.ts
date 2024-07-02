
import axios from 'axios';
import os from 'os';


export const getDate = (dateString: any): string  => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export type user = {
  id: number;
  googleId: string;
  fortytwoId: number;
  middlename: string;
  name: string;
  password: string;
  picture: string;
  banner_picture: string;
  status: string;
  level: number;
  createdAt: Date;
  twoFa: boolean;
  twoFaSecret: string;
};

export const getCookie = (name: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue;
  } else {
    return undefined;
  }
};

export const getTime = (datetime: any): string  => {
    const dateObj = new Date(datetime);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
}

export const getShortDate = (date: Date | null) => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};


export const fetchData = async (url: string, method: string, body : any) : Promise<any> => {
  const accessToken = getCookie("access_token");
  if (!accessToken) return null;
  url = `https://${ipAdress}${url}`;
  
  switch (method) {
    case "GET":
      const res = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
          }
        })
      .then((data) => {
        return data;
      })
      .catch((err) => { return Promise.reject(err) });
      return res;
    case "POST":
      const resPost = await axios.post(url, body,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      .then((data) => {
        return data;
      })
      .catch((err) => { return Promise.reject(err) });
      return resPost;
    case "PUT":
      const resPut = await axios.put(url, body,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      .then((data) => {
        return data;
      })
      .catch((err) => { return Promise.reject(err) });
      return resPut;
    case "DELETE":
      const resDelete = await axios.delete(url,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      .then((data) => {
        return data;
      })
      .catch((err) => { return Promise.reject(err) });
      return resDelete;

    default:
      return Promise.reject("Invalid method");
  }
}


// Find the IPv4 address
export const ipAdress = process.env.NEXT_PUBLIC_API_URL;

