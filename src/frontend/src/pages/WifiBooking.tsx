import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Loader2,
  MapPin,
  Upload,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { AppLayout, PageHeader } from "../components/AppLayout";
import { useSubmitWifiBooking } from "../hooks/useQueries";

const airtelPlans = [
  {
    speed: "40 Mbps",
    price: 599,
    label: "Basic",
    benefit: "Everyday browsing & streaming",
  },
  {
    speed: "100 Mbps",
    price: 799,
    label: "Standard",
    benefit: "HD streaming & gaming",
  },
  {
    speed: "200 Mbps",
    price: 999,
    label: "Premium",
    benefit: "4K streaming & work from home",
  },
  {
    speed: "300 Mbps",
    price: 1499,
    label: "Ultra",
    benefit: "Ultra-fast for entire family",
  },
];

const OFFER_TEXT =
  "🎁 LIMITED TIME OFFER. Wifi book kare 1500₹ me or 3 Mahine chalaye or uske baad 10 Mahine tak her bill cycle me 100₹/ Month ka discount hasil kare";

export default function WifiBooking() {
  const search = useSearch({ strict: false }) as { type?: string };
  const isIPTV = search?.type === "iptv";

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState(
    isIPTV ? "WiFi + IPTV" : "Only WiFi",
  );
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [locationLoading, setLocationLoading] = useState(false);

  const submitMutation = useSubmitWifiBooking();

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Aapka browser location support nahi karta");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const latStr = lat.toFixed(6);
          const lonStr = lon.toFixed(6);
          const mapsLink = `https://www.google.com/maps?q=${latStr},${lonStr}`;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latStr}&lon=${lonStr}`,
          );
          const data = await res.json();
          const addr = data.display_name || `${latStr}, ${lonStr}`;
          setFullAddress(addr);
          setLatitude(latStr);
          setLongitude(lonStr);
          setGoogleMapsLink(mapsLink);
          toast.success("Location mil gayi!");
        } catch {
          toast.error("Location nahi mili, manually daalein");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        toast.error("Location permission denied, manually daalein");
        setLocationLoading(false);
      },
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerName.trim()) e.customerName = "Naam zaroori hai";
    if (!mobileNumber.trim() || mobileNumber.length < 10)
      e.mobileNumber = "Valid mobile number daalein";
    if (!fullAddress.trim()) e.fullAddress = "Address zaroori hai";
    if (!paymentScreenshot)
      e.paymentScreenshot = "Payment screenshot upload karein";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let aadhaarFrontBlob: ExternalBlob | null = null;
    let aadhaarBackBlob: ExternalBlob | null = null;
    let paymentBlob: ExternalBlob | null = null;

    if (aadhaarFront) {
      const bytes = new Uint8Array(await aadhaarFront.arrayBuffer());
      aadhaarFrontBlob = ExternalBlob.fromBytes(bytes);
    }
    if (aadhaarBack) {
      const bytes = new Uint8Array(await aadhaarBack.arrayBuffer());
      aadhaarBackBlob = ExternalBlob.fromBytes(bytes);
    }
    if (paymentScreenshot) {
      const bytes = new Uint8Array(await paymentScreenshot.arrayBuffer());
      paymentBlob = ExternalBlob.fromBytes(bytes);
    }

    try {
      await submitMutation.mutateAsync({
        customerName,
        mobileNumber,
        fullAddress,
        serviceType,
        aadhaarFront: aadhaarFrontBlob,
        aadhaarBack: aadhaarBackBlob,
        paymentScreenshot: paymentBlob,
        latitude,
        longitude,
        googleMapsLink,
      });
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Dobara try karein.");
    }
  };

  if (submitted) {
    return (
      <AppLayout>
        <PageHeader
          title={isIPTV ? "WiFi + IPTV Booking" : "Airtel WiFi Booking"}
        />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">
            Booking Submit Ho Gayi!
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Aapki booking submit ho gayi! Manoj ji jald hi aapse contact
            karenge.
          </p>
          <div className="mt-6 bg-muted rounded-xl p-4 text-left w-full">
            <p className="text-xs text-muted-foreground">Booking details:</p>
            <p className="text-sm font-medium mt-1">{customerName}</p>
            <p className="text-sm text-muted-foreground">{mobileNumber}</p>
            <p className="text-sm text-muted-foreground">{serviceType}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={isIPTV ? "WiFi + IPTV Booking" : "Airtel WiFi Booking"}
      />

      {/* Scrolling Offer Ticker */}
      <div className="overflow-hidden bg-gradient-to-r from-red-600 to-red-500 py-2">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-white text-xs font-medium px-4">
            {OFFER_TEXT} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {OFFER_TEXT}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Airtel WiFi Plans */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wifi className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              Airtel WiFi Plans
            </h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {airtelPlans.map((plan) => (
              <div
                key={plan.label}
                className="min-w-[140px] bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-3 flex flex-col gap-1.5 shrink-0"
              >
                <span className="text-xs font-semibold text-primary bg-red-100 rounded-full px-2 py-0.5 self-start">
                  {plan.label}
                </span>
                <p className="text-lg font-bold text-foreground">
                  {plan.speed}
                </p>
                <p className="text-base font-bold text-primary">
                  ₹{plan.price}
                  <span className="text-xs font-normal text-muted-foreground">
                    /mo
                  </span>
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {plan.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-800 text-xs leading-relaxed">
            WiFi Booking Confirm karne ke liye{" "}
            <strong>₹1500 advance payment kare</strong>
          </p>
        </div>

        {/* QR Code for Payment */}
        <div className="flex flex-col items-center">
          <div className="bg-white border-2 border-border rounded-2xl p-4 shadow-sm">
            <img
              src="/assets/generated/upi-qr-code.dim_400x400.png"
              alt="UPI QR Code"
              className="w-52 h-52 object-contain"
            />
          </div>
          <p className="text-sm font-semibold mt-3">
            Scan karke ₹1500 Pay Karen
          </p>
          <p className="text-xs text-muted-foreground">
            Screenshot zaroor save karein
          </p>
        </div>

        {/* Customer Name */}
        <div className="space-y-1.5">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            data-ocid="wifi.input"
            placeholder="Apna naam daalein"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          {errors.customerName && (
            <p
              className="text-xs text-destructive"
              data-ocid="wifi.error_state"
            >
              {errors.customerName}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <Label htmlFor="mobileNumber">Mobile Number *</Label>
          <Input
            id="mobileNumber"
            data-ocid="wifi.input"
            type="tel"
            placeholder="10 digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
          />
          {errors.mobileNumber && (
            <p
              className="text-xs text-destructive"
              data-ocid="wifi.error_state"
            >
              {errors.mobileNumber}
            </p>
          )}
        </div>

        {/* Full Address */}
        <div className="space-y-1.5">
          <Label htmlFor="fullAddress">Full Address *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 border-primary/40 text-primary"
            onClick={handleGetLocation}
            disabled={locationLoading}
            data-ocid="wifi.button"
          >
            {locationLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            {locationLoading
              ? "Location dhundh raha hai..."
              : "Current Location Use Karein"}
          </Button>
          <Textarea
            id="fullAddress"
            data-ocid="wifi.textarea"
            placeholder="Ghar ka pura address daalein"
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            rows={3}
          />
          {/* Show coordinates and Maps link if location was captured */}
          {latitude && longitude && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-semibold text-green-800">
                📍 Location Captured
              </p>
              <p className="text-xs text-green-700">
                <span className="font-medium">Lat:</span> {latitude} &nbsp;
                <span className="font-medium">Long:</span> {longitude}
              </p>
              {googleMapsLink && (
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Google Maps mein dekho
                </a>
              )}
            </div>
          )}
          {errors.fullAddress && (
            <p
              className="text-xs text-destructive"
              data-ocid="wifi.error_state"
            >
              {errors.fullAddress}
            </p>
          )}
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <Label>Service Type *</Label>
          <RadioGroup
            value={serviceType}
            onValueChange={setServiceType}
            data-ocid="wifi.radio"
          >
            <div className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-muted transition-colors">
              <RadioGroupItem value="Only WiFi" id="wifi-only" />
              <Label htmlFor="wifi-only" className="cursor-pointer font-normal">
                Only WiFi
              </Label>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-muted transition-colors">
              <RadioGroupItem value="WiFi + IPTV" id="wifi-iptv" />
              <Label htmlFor="wifi-iptv" className="cursor-pointer font-normal">
                WiFi + IPTV
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* File uploads */}
        <FileUpload
          label="Aadhaar Card Front"
          id="aadhaarFront"
          ocid="wifi.upload_button"
          onChange={setAadhaarFront}
          file={aadhaarFront}
        />
        <FileUpload
          label="Aadhaar Card Back"
          id="aadhaarBack"
          ocid="wifi.upload_button"
          onChange={setAadhaarBack}
          file={aadhaarBack}
        />
        <FileUpload
          label="Payment Screenshot *"
          id="paymentScreenshot"
          ocid="wifi.upload_button"
          onChange={setPaymentScreenshot}
          file={paymentScreenshot}
          error={errors.paymentScreenshot}
        />

        <Button
          data-ocid="wifi.submit_button"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl text-base"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submit ho raha
              hai...
            </>
          ) : (
            "Booking Submit Karen"
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground pb-4">
          Submit karne ke baad Manoj ji aapse contact karenge
        </p>
      </div>
    </AppLayout>
  );
}

function FileUpload({
  label,
  id,
  ocid,
  onChange,
  file,
  error,
}: {
  label: string;
  id: string;
  ocid: string;
  onChange: (f: File | null) => void;
  file: File | null;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        data-ocid={ocid}
        className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
      >
        {file ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              {file.name}
            </span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Tap karke file choose karein
            </span>
          </>
        )}
        <input
          id={id}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {error && (
        <p className="text-xs text-destructive" data-ocid="wifi.error_state">
          {error}
        </p>
      )}
    </div>
  );
}
