import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "../components/AppLayout";

export default function OtherPayment() {
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!serviceName.trim()) e.serviceName = "Service ka naam zaroori hai";
    if (!amount.trim() || Number(amount) <= 0)
      e.amount = "Valid amount daalein";
    if (!paymentFile) e.paymentFile = "Payment screenshot upload karein";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout>
        <PageHeader title="Other Services Payment" />
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
            Aapka payment request submit ho gaya! Jald hi confirm hoga.
          </p>
          <div className="mt-6 bg-muted rounded-xl p-4 text-left w-full">
            <p className="text-xs text-muted-foreground">Payment details:</p>
            <p className="text-sm font-medium mt-1">{serviceName}</p>
            <p className="text-sm text-primary font-bold">₹{amount}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Other Services Payment" />
      <div className="px-4 py-4 space-y-5">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-blue-800 text-xs">
            Kisi bhi service ka payment karein —{" "}
            <strong>QR scan karke payment karen</strong> aur screenshot upload
            karein.
          </p>
        </div>

        {/* Service name */}
        <div className="space-y-1.5">
          <Label htmlFor="serviceName">Service ka Naam / Description *</Label>
          <Input
            id="serviceName"
            data-ocid="otherpay.input"
            placeholder="Jaise: Dish TV recharge, Bill payment..."
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          {errors.serviceName && (
            <p
              className="text-xs text-destructive"
              data-ocid="otherpay.error_state"
            >
              {errors.serviceName}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (₹) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₹
            </span>
            <Input
              id="amount"
              data-ocid="otherpay.input"
              type="number"
              placeholder="0"
              className="pl-7"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {errors.amount && (
            <p
              className="text-xs text-destructive"
              data-ocid="otherpay.error_state"
            >
              {errors.amount}
            </p>
          )}
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
          <p className="text-xs text-muted-foreground">
            QR scan karke payment karein
          </p>
        </div>

        {/* Upload screenshot */}
        <div className="space-y-1.5">
          <Label>Payment Screenshot Upload Karen *</Label>
          <label
            data-ocid="otherpay.upload_button"
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
          {errors.paymentFile && (
            <p
              className="text-xs text-destructive"
              data-ocid="otherpay.error_state"
            >
              {errors.paymentFile}
            </p>
          )}
        </div>

        <Button
          data-ocid="otherpay.confirm_button"
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
            "Payment Submit Karen"
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
