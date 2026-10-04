import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "@/components/Layout";
import { LanguageProvider } from "@/state/LanguageContext";
import { RegionProvider } from "@/state/RegionContext";
import Dashboard from "@/pages/Dashboard";
import SiteDetail from "@/pages/SiteDetail";
import Report from "@/pages/Report";
import OahCities from "@/pages/OahCities";
import Methodology from "@/pages/Methodology";
import MyReports from "@/pages/MyReports";
import RangerQueue from "@/pages/RangerQueue";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <RegionProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/site/:id" element={<SiteDetail />} />
              <Route path="/report" element={<Report />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/rangers" element={<RangerQueue />} />
              <Route path="/oah-cities" element={<OahCities />} />
              <Route path="/methodology" element={<Methodology />} />
            </Routes>
          </Layout>
        </RegionProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
