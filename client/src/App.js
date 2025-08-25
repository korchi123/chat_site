
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { Spinner } from "react-bootstrap";


const App=observer( ()=>{
    const { authStore } = useContext(Context);
    const [loading, setLoading]=useState(true)
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (localStorage.getItem('accessToken')) {
                    await authStore.checkAuth();
                }
            } catch (e) {
                console.error("Auth check failed:", e);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [authStore]);

        if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }


  return (
    
    <BrowserRouter basename="/">
      <NavBar />
      <AppRouter />
       
    </BrowserRouter>
    
  );
})

export default App;