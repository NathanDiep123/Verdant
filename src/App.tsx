import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/Layout";
import { RegionProvider } from "@/state/RegionContext";
import Dashboard from "@/pages/Dashboard";
import SiteDetail from "@/pages/SiteDetail";
import Report from "@/pages/Report";
import OahCities from "@/pages/OahCities";
import Methodology from "@/pages/Methodology";

export default function App() {
  return (
    <BrowserRouter>
      <RegionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/site/:id" element={<SiteDetail />} />
            <Route path="/report" element={<Report />} />
            <Route path="/oah-cities" element={<OahCities />} />
            <Route path="/methodology" element={<Methodology />} />
          </Routes>
        </Layout>
      </RegionProvider>
    </BrowserRouter>
  );
}
