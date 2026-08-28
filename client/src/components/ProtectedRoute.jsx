import React from "react";
import {Navigate,useLocation} from "react-router-dom";
import {useAuth} from "../context/useAuth";
export default function ProtectedRoute({children}){const {admin,loading}=useAuth();const location=useLocation();if(loading)return <div style={{minHeight:"100vh",background:"#202327",color:"#fff",display:"grid",placeItems:"center"}}>Loading secure area...</div>;return admin?children:<Navigate to="/login" replace state={{from:location}}/>}
