import React from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { MisAlumnos } from "./components/MisAlumnos";
import { Profile } from "./components/Profile";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { CargaDatos } from "./components/CargaDatos";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "docente/alumnos", Component: MisAlumnos },
      { path: "ingesta", Component: CargaDatos },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings }
    ],
  },
]);