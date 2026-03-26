import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "../components/AppLayout";

export default function PayNow() {
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!paymentFile) {
      toast.error("Payment screenshot upload karein");
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout>
        <PageHeader title="₹1500 Payment" />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-xl font-bold">Payment Submit Ho Gaya!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Payment screenshot submit ho gaya! Confirmation ke liye wait karen.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="₹1500 Payment Karen" />
      <div className="px-4 py-4 space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-amber-800 text-xs">
            WiFi Booking ke liye <strong>₹1500 advance payment kare</strong>
          </p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <div className="bg-white border-2 border-border rounded-2xl p-4 shadow-card">
            <img
              src="/assets/generated/upi-qr-code.dim_400x400.png"
              alt="UPI QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="text-sm font-semibold mt-3">Scan to Pay</p>
          <p className="text-xs text-muted-foreground">Amount: ₹1500</p>
        </div>

        {/* Upload screenshot */}
        <div className="space-y-1.5">
          <Label>Payment Screenshot Upload Karen *</Label>
          <label
            data-ocid="payment.upload_button"
            className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
          >
            {paymentFile ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-xs text-green-600">
                  {paymentFile.name}
                </span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Screenshot select karein
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPaymentFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <Button
          data-ocid="payment.confirm_button"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl text-base"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submit ho raha hai...
            </>
          ) : (
            "Payment Confirm Karen"
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
