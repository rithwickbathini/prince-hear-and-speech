import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "../components/Footer";
import { MobileActionBar } from "../components/MobileActionBar";
import { Navbar } from "../components/Navbar";
import { WhatsAppButton } from "../components/WhatsAppButton";

export function PublicLayout() {
  const { pathname } = useLocation();
  // The booking page already owns the bottom of the screen with its own step
  // controls, so the quick-action bar would be redundant (and could overlap) there.
  const showActionBar = pathname !== "/book-appointment";

  return (
    <div className={`flex min-h-screen flex-col ${showActionBar ? "pb-16 sm:pb-0" : ""}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      {showActionBar && <MobileActionBar />}
    </div>
  );
}
