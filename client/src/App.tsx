import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { PublicLayout } from "./layouts/PublicLayout";
import About from "./pages/About";
import AdminAppointments from "./pages/admin/Appointments";
import AdminAvailability from "./pages/admin/Availability";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/Login";
import AdminServices from "./pages/admin/Services";
import AdminTherapists from "./pages/admin/Therapists";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Therapists from "./pages/Therapists";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/therapists" element={<Therapists />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="therapists" element={<AdminTherapists />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="availability" element={<AdminAvailability />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
