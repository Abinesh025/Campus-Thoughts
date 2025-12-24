import { data, Navigate, Route,Routes } from "react-router-dom"
import HomePage from "./Pages/Author/home/HomePage.jsx"
import SignUpPage from "./Pages/Author/signup/SignUp.jsx"
import LoginPage from "./Pages/Author/login/LoginPage.jsx"
import Sidebar from "./components/common/Sidebar.jsx"
import RightPanel from "./components/common/RightPanel.jsx"
import NotificationPage from "./Pages/Author/notification/notification.jsx"
import ProfilePage from "./Pages/Author/profile/ProfilePage.jsx";
import  { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query"
import { baseUrl } from "./Pages/Author/sens/sens.jsx"
import LoadingSpinner from "./components/common/LoadingSpinner.jsx"

function App() {

  const {data:authuser,isLoading} = useQuery({
    queryKey:["authuser"],
    queryFn:async()=>{
      try{
          const res = await fetch(`${baseUrl}/api/auther/me`,{
            method:"GET",
            credentials:"include",
            headers:{
              "content-type":"application/json"
            },
          }
        )
        const data =await res.json()
          if(data.error){
          return null
        }
        
        if(!res.ok){
          throw new Error(data.error || "Something Went Wrong");
        }
        return data

      }
      catch(error)
      {
        throw error
      }
    },retry:false
  });

  
  if(isLoading){
    return (
      <div className="flex justify-center items-center h-screen" >
        <LoadingSpinner size="lg"/>
      </div>
    )
  }
  return (
    <div className="flex max-w-6x1 mx-auto">
      {authuser && <Sidebar />  }
        <Routes>
          <Route path="/" element={ authuser ? <HomePage/> : <Navigate to="/login" />}/>
          <Route path="/signup" element={!authuser ? <SignUpPage/> : <Navigate to="/login" />} />
          <Route path="/login" element={!authuser ? <LoginPage/> : <Navigate to="/" />} />
          <Route path="/notification" element={authuser ? <NotificationPage/> : <Navigate to="/login" />} />
          <Route path="/profile/:StudentName" element={authuser ? <ProfilePage/> : <Navigate to="/login" />}  /> 
        </Routes>
        {authuser && <RightPanel/> }
      <Toaster />
    </div>
    
  )
}

export default App
