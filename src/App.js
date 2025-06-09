import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "@mui/material/Container";

import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";
import {
  Home,
  Login,
  Registration,
  CreateAd,
  AdDetails,
  Profile,
} from "./pages";
import { Navbar } from "./components";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/create" element={<CreateAd />} />
          <Route path="/ads/:id" element={<AdDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
