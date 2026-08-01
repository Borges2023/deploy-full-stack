import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Artists from "./pages/Artists";
import Artist from "./pages/Artist";
import Songs from "./pages/Songs";
import Song from "./pages/Song";
import AdvertisingAdmin from "./pages/AdvertisingAdmin";
import { AdvertisingProvider } from "./advertising/AdvertisingContext";

const App = () => {
  return (
    <AdvertisingProvider>
    <BrowserRouter>
      <Header />

      <main className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artist/:id" element={<Artist />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/song/:id" element={<Song />} />
          <Route path="/admin/publicidade" element={<AdvertisingAdmin />} />
        </Routes>
      </main>

      <footer className="site-footer">
        RifllyMusical@todosdireitos reservados
      </footer>
    </BrowserRouter>
    </AdvertisingProvider>
  );
};

export default App;
