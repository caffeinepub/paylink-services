import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import DishRecharge from "./pages/DishRecharge";
import Home from "./pages/Home";
import MobileRecharge from "./pages/MobileRecharge";
import OtherPayment from "./pages/OtherPayment";
import PayNow from "./pages/PayNow";
import PaymentBank from "./pages/PaymentBank";
import QRCodePage from "./pages/QRCode";
import WifiBooking from "./pages/WifiBooking";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const wifiBookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wifi-booking",
  component: WifiBooking,
});

const mobileRechargeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mobile-recharge",
  component: MobileRecharge,
});

const dishRechargeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dish-recharge",
  component: DishRecharge,
});

const paymentBankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-bank",
  component: PaymentBank,
});

const payNowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pay-now",
  component: PayNow,
});

const otherPaymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/other-payment",
  component: OtherPayment,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const qrCodeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/qr",
  component: QRCodePage,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,
  wifiBookingRoute,
  mobileRechargeRoute,
  dishRechargeRoute,
  paymentBankRoute,
  payNowRoute,
  otherPaymentRoute,
  contactRoute,
  adminRoute,
  qrCodeRoute,
]);
