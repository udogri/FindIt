// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import LostAndFound from './pages/LostAndFound';
import Community from './pages/Community';
import { Box, Flex } from '@chakra-ui/react';

function App() {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <Box flex="1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/community" element={<Community />} />
        </Routes>
      </Box>
      <Footer />
    </Flex>
  );
}

export default App;
