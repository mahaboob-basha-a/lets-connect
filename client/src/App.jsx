import React from 'react';
import SignIn from './components/SignIn';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import AddChat from './components/AddChat';
import ChatPage from './components/ChatPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/chat/:id' element={<ChatPage />} />
        <Route path='/new-chat' element={<AddChat />} />
        <Route path='*' element={<Home />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App;