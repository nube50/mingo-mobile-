import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL,timeout:15000,headers:{'Content-Type':'application/json'}});
api.interceptors.request.use(c=>{const t=localStorage.getItem('mingo_token');if(t)c.headers.Authorization='Bearer '+t;return c;});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401){localStorage.removeItem('mingo_token');localStorage.removeItem('mingo_usuario');window.location.href='/';}return Promise.reject(e);});
export default api;
