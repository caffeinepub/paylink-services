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
import { useSubmitDishRecharge } from "../hooks/useQueries";

export default function DishRecharge() {
  const [customerId, setCustomerId] = useState("");
  const [operator, setOperator] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useSubmitDishRecharge();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerId.trim()) e.customerId = "Customer ID daalein";
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
        customerId,
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
        <PageHeader title="Dish TV Recharge" />
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

  return (
    <AppLayout>
      <PageHeader title="Dish TV Recharge" />
      <div className="px-4 py-4 space-y-4">
        <div className="space-y-1.5">
          <Label>Customer ID *</Label>
          <Input
            data-ocid="dish.input"
            placeholder="Dish TV Customer ID daalein"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          {errors.customerId && (
            <p
              className="text-xs text-destructive"
              data-ocid="dish.error_state"
            >
              {errors.customerId}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Operator *</Label>
          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger data-ocid="dish.select">
              <SelectValue placeholder="Operator choose karein" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dish TV">Dish TV</SelectItem>
              <SelectItem value="Tata Play">Tata Play</SelectItem>
              <SelectItem value="Sun Direct">Sun Direct</SelectItem>
              <SelectItem value="Videocon D2H">Videocon D2H</SelectItem>
            </SelectContent>
          </Select>
          {errors.operator && (
            <p
              className="text-xs text-destructive"
              data-ocid="dish.error_state"
            >
              {errors.operator}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₹
            </span>
            <Input
              data-ocid="dish.input"
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
              data-ocid="dish.error_state"
            >
              {errors.amount}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Payment Screenshot</Label>
          <label
            data-ocid="dish.upload_button"
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
          data-ocid="dish.submit_button"
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
