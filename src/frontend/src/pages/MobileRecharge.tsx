import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { AppLayout, PageHeader } from "../components/AppLayout";
import { useSubmitMobileRecharge } from "../hooks/useQueries";

type Plan = { amount: string; validity: string; data: string; calls: string };
type PlanType = "monthly" | "3month" | "yearly";

const plans: Record<
  string,
  { monthly: Plan[]; "3month": Plan[]; yearly: Plan[] }
> = {
  Airtel: {
    monthly: [
      {
        amount: "199",
        validity: "28 days",
        data: "1GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "299",
        validity: "28 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "359",
        validity: "28 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "479",
        validity: "56 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "599",
        validity: "84 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
    ],
    "3month": [
      {
        amount: "719",
        validity: "84 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "839",
        validity: "84 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
    yearly: [
      {
        amount: "2999",
        validity: "365 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "3599",
        validity: "365 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
  },
  Jio: {
    monthly: [
      {
        amount: "189",
        validity: "28 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "299",
        validity: "28 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "349",
        validity: "28 days",
        data: "3GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "479",
        validity: "56 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "599",
        validity: "84 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
    ],
    "3month": [
      {
        amount: "719",
        validity: "84 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "899",
        validity: "84 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
    yearly: [
      {
        amount: "2879",
        validity: "365 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "3599",
        validity: "365 days",
        data: "2.5GB/day",
        calls: "Unlimited calls",
      },
    ],
  },
  Vi: {
    monthly: [
      {
        amount: "199",
        validity: "28 days",
        data: "1GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "299",
        validity: "28 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "379",
        validity: "28 days",
        data: "2.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "479",
        validity: "56 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
    ],
    "3month": [
      {
        amount: "719",
        validity: "84 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "899",
        validity: "84 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
    yearly: [
      {
        amount: "2899",
        validity: "365 days",
        data: "1.5GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "3499",
        validity: "365 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
  },
  BSNL: {
    monthly: [
      {
        amount: "187",
        validity: "28 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "247",
        validity: "30 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "397",
        validity: "60 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
    "3month": [
      {
        amount: "597",
        validity: "90 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "797",
        validity: "180 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
    ],
    yearly: [
      {
        amount: "1999",
        validity: "365 days",
        data: "2GB/day",
        calls: "Unlimited calls",
      },
      {
        amount: "2399",
        validity: "365 days",
        data: "3GB/day",
        calls: "Unlimited calls",
      },
    ],
  },
};

const planTabs: { key: PlanType; label: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "3month", label: "3 Month" },
  { key: "yearly", label: "Yearly" },
];

export default function MobileRecharge() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [planType, setPlanType] = useState<PlanType>("monthly");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useSubmitMobileRecharge();

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan.amount);
    setAmount(plan.amount);
    setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handlePlanTypeChange = (type: PlanType) => {
    setPlanType(type);
    setSelectedPlan(null);
    setAmount("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!mobileNumber.trim() || mobileNumber.length < 10)
      e.mobileNumber = "Valid mobile number daalein";
    if (!operator) e.operator = "Operator select karein";
    if (!amount.trim() || Number(amount) <= 0)
      e.amount = "Valid amount daalein";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    let paymentBlob: ExternalBlob | null = null;
    if (paymentFile) {
      const bytes = new Uint8Array(await paymentFile.arrayBuffer());
      paymentBlob = ExternalBlob.fromBytes(bytes);
    }
    try {
      await submitMutation.mutateAsync({
        mobileNumber,
        operator,
        amount,
        paymentScreenshot: paymentBlob,
      });
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Dobara try karein.");
    }
  };

  if (submitted) {
    return (
      <AppLayout>
        <PageHeader title="Mobile Recharge" />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-xl font-bold">Request Submit Ho Gaya!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Aapka recharge request submit ho gaya! Jald hi process hoga.
          </p>
        </div>
      </AppLayout>
    );
  }

  const currentPlans =
    operator && plans[operator] ? plans[operator][planType] : [];

  return (
    <AppLayout>
      <PageHeader title="Mobile Recharge" />
      <div className="px-4 py-4 space-y-4">
        <div className="space-y-1.5">
          <Label>Mobile Number *</Label>
          <Input
            data-ocid="recharge.input"
            type="tel"
            placeholder="10 digit number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
          />
          {errors.mobileNumber && (
            <p
              className="text-xs text-destructive"
              data-ocid="recharge.error_state"
            >
              {errors.mobileNumber}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Operator *</Label>
          <Select
            value={operator}
            onValueChange={(val) => {
              setOperator(val);
              setSelectedPlan(null);
              setAmount("");
              setPlanType("monthly");
            }}
          >
            <SelectTrigger data-ocid="recharge.select">
              <SelectValue placeholder="Operator choose karein" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Airtel">Airtel</SelectItem>
              <SelectItem value="Jio">Jio</SelectItem>
              <SelectItem value="Vi">Vi (Vodafone Idea)</SelectItem>
              <SelectItem value="BSNL">BSNL</SelectItem>
            </SelectContent>
          </Select>
          {errors.operator && (
            <p
              className="text-xs text-destructive"
              data-ocid="recharge.error_state"
            >
              {errors.operator}
            </p>
          )}
        </div>

        {/* Plan Type Tabs */}
        {operator && (
          <div>
            <p className="text-sm font-bold text-foreground mb-2">Plans</p>
            <div className="flex gap-2 mb-3" data-ocid="recharge.tab">
              {planTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handlePlanTypeChange(tab.key)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border transition-all ${
                    planType === tab.key
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {currentPlans.map((plan, idx) => (
                <button
                  key={`${operator}-${planType}-${plan.amount}`}
                  type="button"
                  data-ocid={`recharge.item.${idx + 1}`}
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    selectedPlan === plan.amount
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedPlan === plan.amount
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      ₹
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        ₹{plan.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plan.validity} • {plan.data} • {plan.calls}
                      </p>
                    </div>
                  </div>
                  {selectedPlan === plan.amount && (
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₹
            </span>
            <Input
              data-ocid="recharge.input"
              type="number"
              placeholder="0"
              className="pl-7"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setSelectedPlan(null);
              }}
            />
          </div>
          {errors.amount && (
            <p
              className="text-xs text-destructive"
              data-ocid="recharge.error_state"
            >
              {errors.amount}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Payment Screenshot</Label>
          <label
            data-ocid="recharge.upload_button"
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
                  Payment screenshot upload karein
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
          data-ocid="recharge.submit_button"
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
            "Recharge Request Submit Karen"
          )}
        </Button>
      </div>
    </AppLayout>
  );
}
