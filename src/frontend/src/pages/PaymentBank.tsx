import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle,
  HelpCircle,
  Loader2,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "../components/AppLayout";
import { useSubmitPaymentBank } from "../hooks/useQueries";

const SERVICE_OPTIONS = [
  {
    id: "Cash Deposit",
    label: "Cash Deposit",
    icon: ArrowDownCircle,
    desc: "Apne account mein paise daalein",
  },
  {
    id: "Cash Withdrawal",
    label: "Cash Withdrawal",
    icon: ArrowUpCircle,
    desc: "Account se paise nikalein",
  },
  {
    id: "Account Opening",
    label: "Account Opening",
    icon: UserPlus,
    desc: "Naya Airtel Bank account kholein",
  },
  {
    id: "Other Service",
    label: "Other Service",
    icon: HelpCircle,
    desc: "Koi aur service ke liye",
  },
];

export default function PaymentBank() {
  const [selectedService, setSelectedService] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useSubmitPaymentBank();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedService) e.service = "Service select karein";
    if (!mobileNumber.trim() || mobileNumber.length < 10)
      e.mobileNumber = "Valid mobile number daalein";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await submitMutation.mutateAsync({
        serviceOption: selectedService,
        mobileNumber,
        notes,
      });
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Dobara try karein.");
    }
  };

  if (submitted) {
    return (
      <AppLayout>
        <PageHeader title="Airtel Payment Bank" />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-xl font-bold">Request Submit Ho Gayi!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Aapki service request submit ho gayi! Manoj ji jald hi aapse contact
            karenge.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Airtel Payment Bank Services" />
      <div className="px-4 py-4 space-y-4">
        <div className="space-y-2">
          <Label>Service Choose Karen *</Label>
          <div className="grid grid-cols-2 gap-2">
            {SERVICE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  type="button"
                  key={opt.id}
                  data-ocid="bank.toggle"
                  onClick={() => setSelectedService(opt.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    selectedService === opt.id
                      ? "border-primary bg-red-50 ring-1 ring-primary/30"
                      : "border-border hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 mb-1.5",
                      selectedService === opt.id
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  />
                  <p className="text-xs font-semibold">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
          {errors.service && (
            <p
              className="text-xs text-destructive"
              data-ocid="bank.error_state"
            >
              {errors.service}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Mobile Number *</Label>
          <Input
            data-ocid="bank.input"
            type="tel"
            placeholder="10 digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
          />
          {errors.mobileNumber && (
            <p
              className="text-xs text-destructive"
              data-ocid="bank.error_state"
            >
              {errors.mobileNumber}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Additional Information (Optional)</Label>
          <Textarea
            data-ocid="bank.textarea"
            placeholder="Koi additional information likhein..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          data-ocid="bank.submit_button"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl text-base"
          onClick={handleSubmit}
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submit ho raha hai...
            </>
          ) : (
            "Service Request Submit Karen"
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
