import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import ChatScreen from "./screens/ChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import FindFriendScreen from "./screens/FindFriendScreen";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";
import Auth from "./components/Auth";
 
function App() {
  return (
    <BrowserRouter>
      <div className="App">
      <ToastContainer position="bottom-center" limit={1} />

        <main>
          <div>
            <Routes>
              <Route path="/" element={<HomeScreen />} />;
              <Route path="/list" element={<Auth><ListScreen /></Auth>} />;
              <Route path="/chat/:id" element={<Auth> <ChatScreen /></Auth>} />;
              <Route path="/profile" element={<Auth> <ProfileScreen /></Auth>} />;
              <Route path="/signin" element={ <SigninScreen />} />;
              <Route path="/signup" element={ <SignupScreen />} />;
              <Route path="/findfriend" element={ <Auth><FindFriendScreen/></Auth>} />;
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
