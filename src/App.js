import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import UserForm from './components/UserForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Game from './components/Game/Game';

const LoadingSpinner = () => {
	return (
    <div className="spinner-container">
      	<div className="loading-spinner">
      	</div>
    </div>
  );
}

export default function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return ( 
      <LoadingSpinner/>
    );
  }
  if (error) {
      return 'There was an error';
  }
  if (!user) {
    return <UserForm/>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Home/>}/>
        <Route path='/game/:id' element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  );
}
