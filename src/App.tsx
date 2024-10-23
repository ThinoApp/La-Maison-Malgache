import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Cta from "./UI/Cta/Cta";
import CoupDeCoeurContainer from "./containers/CoupDeCoeurContainer";
import HeroContainer from "./containers/HeroContainer";
import CoupDeCoeurDetailContainer from "./containers/CoupDeCoeurDetailContainer";
import Produits from "./UI/Produits/Produits";
import AppLayout from "./layout/AppLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: (
          <>
            <HeroContainer />
            <div>
              <CoupDeCoeurContainer />
              <Cta />
            </div>
          </>
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
