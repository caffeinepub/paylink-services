import { useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  CreditCard,
  IndianRupee,
  Phone,
  Shield,
  Smartphone,
  Tv,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { AppLayout } from "../components/AppLayout";

const services = [
  {
    id: "wifi-booking",
    title: "Airtel WiFi Booking",
    subtitle: "New connection ke liye",
    icon: Wifi,
    color: "bg-red-50 text-primary",
    path: "/wifi-booking",
  },
  {
    id: "mobile-recharge",
    title: "Mobile Recharge",
    subtitle: "Airtel, Jio, Vi, BSNL",
    icon: Smartphone,
    color: "bg-green-50 text-green-600",
    path: "/mobile-recharge",
  },
  {
    id: "dish-recharge",
    title: "Dish TV Recharge",
    subtitle: "DTH recharge karein",
    icon: Tv,
    color: "bg-purple-50 text-purple-600",
    path: "/dish-recharge",
  },
  {
    id: "payment-bank",
    title: "Airtel Payment Bank",
    subtitle: "Deposit, withdraw & more",
    icon: Banknote,
    color: "bg-orange-50 text-orange-600",
    path: "/payment-bank",
  },
  {
    id: "pay-now",
    title: "Pay ₹1500 Now",
    subtitle: "WiFi booking advance",
    icon: IndianRupee,
    color: "bg-red-50 text-primary",
    path: "/pay-now",
    highlight: true,
  },
  {
    id: "other-payment",
    title: "Other Services Payment",
    subtitle: "Kisi bhi service ka payment",
    icon: CreditCard,
    color: "bg-blue-50 text-blue-600",
    path: "/other-payment",
  },
  {
    id: "contact",
    title: "Contact Vasu Comm.",
    subtitle: "Manoj: 7339891179",
    icon: Phone,
    color: "bg-slate-50 text-slate-600",
    path: "/contact",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleServiceClick = (path: string) => {
    navigate({ to: path });
  };

  return (
    <AppLayout>
      <header className="bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary rounded-xl p-2">
            <Wifi className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-foreground">
              PayLink Services
            </h1>
            <p className="text-xs text-muted-foreground">Vasu Communication</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/admin" })}
          className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
          data-ocid="nav.link"
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </button>
      </header>

      <div className="hero-gradient px-4 py-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">
              Airtel Official Partner
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-2">Vasu Communication</h2>
          <p className="text-white/80 text-sm mt-1">
            Airtel WiFi, Recharge & Payment Services
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-xl font-bold">500+</p>
              <p className="text-white/60 text-xs">Connections</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold">24/7</p>
              <p className="text-white/60 text-xs">Support</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold">Fast</p>
              <p className="text-white/60 text-xs">Activation</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 py-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Hamare Services
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                type="button"
                data-ocid={`service.${service.id}.button`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => handleServiceClick(service.path)}
                className={`service-card flex flex-col items-start gap-2 p-4 rounded-2xl border bg-card shadow-card text-left w-full ${
                  (service as { highlight?: boolean }).highlight
                    ? "border-primary/30 bg-red-50/50"
                    : "border-border"
                }`}
              >
                <div className={`p-2 rounded-xl ${service.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground leading-tight">
                    {service.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {service.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="col-span-2 bg-primary rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-white font-bold text-base">
                New WiFi Connection?
              </p>
              <p className="text-white/70 text-xs mt-0.5">
                ₹1500 advance mein booking karein
              </p>
            </div>
            <button
              type="button"
              data-ocid="home.primary_button"
              onClick={() => navigate({ to: "/wifi-booking" })}
              className="bg-white text-primary font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
            >
              Book Now
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
