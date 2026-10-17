import axios from 'axios';
const API=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:8080/api'});
API.interceptors.request.use(c=>{const t=localStorage.getItem('travelmate_token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
export default API;
