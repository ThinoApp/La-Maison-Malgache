import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Cta from "./UI/Cta/Cta";
import CoupDeCoeurContainer from "./containers/CoupDeCoeurContainer";
import HeroContainer from "./containers/HeroContainer";
import CoupDeCoeurDetailContainer from "./containers/CoupDeCoeurDetailContainer";
import Produits from "./UI/Produits/Produits";
import AppLayout from "./layout/AppLayout";
import { AnimatePresence } from "framer-motion";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: (
          <AnimatePresence mode="wait">
            <main className="home-page">
              <section id="hero" className="hero-section">
                <HeroContainer />
              </section>
              <div className="content-sections">
                <section id="coups-de-coeur" className="section-container">
                  <CoupDeCoeurContainer />
                </section>
                <section id="categories" className="section-container">
                  <Cta />
                </section>
              </div>
            </main>
          </AnimatePresence>
        ),
      },
      {
        path: "/coup-de-coeur/detail/:id",
        element: <CoupDeCoeurDetailContainer />,
      },
      {
        path: "/produits",
        element: <Produits />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
