import { createBrowserRouter } from "react-router-dom";
import { Home } from "../src/pages/home"
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { DashDoard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { CarDetail } from "./pages/car";

import { Layout } from "./components/layout";
import { Private } from './routes/Private'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: "/car/:id",
        element: <CarDetail/>
      },
      {
        path: "dashboard",
        element: <Private><DashDoard/></Private>
      },
      {
        path: "/dashboard/new",
        element: <Private><New/></Private>
      }
    ]
  },
  {
    path: "login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register/>
  }
])

export { router }