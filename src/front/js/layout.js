import React, {useContext} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import injectContext, {Context} from "./store/appContext";
import { Footer } from "./component/footer";
import { NavbarWrapper } from "./component/NavbarWrapper";
import { Vehicles } from "./pages/Vehicles";
import { AdminAddVehicle } from "./pages/AdminAddVehicle";
import { AdminManageVehicles } from "./pages/AdminManageVehicles";
import { Profile } from "./pages/Profile.js";
import { Reserve } from "./pages/Reserve.js";
import { Cancel } from "./pages/Cancel.js";
import { Success } from "./pages/Success.js";
import { Geeks } from "./pages/Geeks.js";

const Layout = () => {
   const { store } = useContext(Context);
   const basename = process.env.BASENAME || "";

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <NavbarWrapper />
                    <Routes>
                        <Route element={<Geeks />} path="/" />
                        <Route element={<Home />} path="/home" />
                        <Route element={<Vehicles />} path="/vehicles" />
                        <Route element={<AdminAddVehicle />} path="/admin/add-vehicle" />
                        <Route element={<AdminManageVehicles />} path="/admin/manage-vehicle" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Reserve />} path="/reserve" />
                        <Route element={<Success />} path="/reserve-vehicle/success" />
                        <Route element={<Cancel />} path="/reserve-vehicle/cancel" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
