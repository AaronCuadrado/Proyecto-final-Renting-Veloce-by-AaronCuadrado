import React, { useContext } from "react";
import { Navbar } from "./Navbar";
import { NavbarAfterLogin } from "./NavbarAfterLogin";
import { Context } from "../store/appContext";

export const NavbarWrapper = () => {
    const { store } = useContext(Context);

    return store.isAuthenticated ? <NavbarAfterLogin /> : <Navbar />;
};
