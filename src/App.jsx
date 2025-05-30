// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LostAndFound from './pages/LostAndFound';
import Community from './pages/Community';
import { Box, Flex } from '@chakra-ui/react';
import LoginSignup from './pages/LoginSignup';

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ['/']; // Add other routes if you want to hide header elsewhere too

  return (
    <Flex direction="column" minHeight="100vh">
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Box flex="1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login/signup" element={<LoginSignup />} />
        </Routes>
      </Box>
      <Footer />
    </Flex>
  );
}

export default App;
