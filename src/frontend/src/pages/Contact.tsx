import { Clock, MapPin, MessageCircle, Phone, Wifi } from "lucide-react";
import { motion } from "motion/react";
import { AppLayout, PageHeader } from "../components/AppLayout";

export default function Contact() {
  return (
    <AppLayout>
      <PageHeader title="Contact Karein" />
      <div className="px-4 py-5 space-y-4">
        {/* Business card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hero-gradient rounded-2xl p-5 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl">Vasu Communication</h2>
              <p className="text-white/70 text-sm">Airtel Authorized Partner</p>
            </div>
          </div>
          <div className="space-y-1.5 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs w-14">Owner</span>
              <span className="font-semibold">Manoj</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs w-14">Phone</span>
              <span className="font-semibold">7339891179</span>
            </div>
          </div>
        </motion.div>

        {/* Contact actions */}
        <div className="space-y-3">
          <a
            href="tel:7339891179"
            data-ocid="contact.primary_button"
            className="flex items-center gap-4 p-4 bg-primary text-white rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors"
          >
            <div className="bg-white/20 rounded-xl p-2">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Call Now</p>
              <p className="text-white/70 text-xs">7339891179</p>
            </div>
          </a>

          <a
            href="https://wa.me/917339891179"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="contact.secondary_button"
            className="flex items-center gap-4 p-4 bg-green-600 text-white rounded-2xl font-bold text-base hover:bg-green-700 transition-colors"
          >
            <div className="bg-white/20 rounded-xl p-2">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">WhatsApp Karen</p>
              <p className="text-white/70 text-xs">Message bhejein</p>
            </div>
          </a>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-border rounded-xl p-3">
            <Clock className="w-4 h-4 text-primary mb-1.5" />
            <p className="text-xs font-semibold">Timing</p>
            <p className="text-xs text-muted-foreground">9 AM – 8 PM</p>
            <p className="text-xs text-muted-foreground">Mon – Sat</p>
          </div>
          <div className="border border-border rounded-xl p-3 col-span-2">
            <MapPin className="w-4 h-4 text-primary mb-1.5" />
            <p className="text-xs font-semibold">Hamara Address</p>
            <p className="text-xs text-muted-foreground">
              Old Bus Stand, Near Pushkar Restaurant
            </p>
            <p className="text-xs text-muted-foreground">
              Pali (Rajasthan) - 306401
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
