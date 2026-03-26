import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Banknote,
  Loader2,
  LogIn,
  LogOut,
  Smartphone,
  Tv,
  Wifi,
} from "lucide-react";
import { AppLayout, PageHeader } from "../components/AppLayout";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllDishRecharges,
  useAllMobileRecharges,
  useAllPaymentBankRequests,
  useAllWifiBookings,
  useIsAdmin,
} from "../hooks/useQueries";
import type {
  DishTVRechargeLead,
  MobileRechargeLead,
  PaymentBankServiceRequest,
  WifiBookingLead,
} from "../hooks/useQueries";

function formatDate(bigintTs: bigint) {
  const ms = Number(bigintTs) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Admin() {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();

  if (!isLoggedIn) {
    return (
      <AppLayout>
        <PageHeader title="Admin Login" />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Saare leads dekhne ke liye login karein
          </p>
          <Button
            data-ocid="admin.primary_button"
            className="mt-6 w-full bg-primary text-white hover:bg-primary/90 rounded-xl py-3 font-bold"
            onClick={login}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Login ho raha hai...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login Karen
              </>
            )}
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (checkingAdmin) {
    return (
      <AppLayout>
        <PageHeader title="Admin Panel" />
        <div className="px-4 py-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <PageHeader title="Admin Panel" />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <p className="text-muted-foreground">Aapko admin access nahi hai.</p>
          <Button variant="outline" onClick={clear} className="mt-4">
            Logout
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title="Admin Panel" />
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Sabke leads yahan dikhenge
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
          </Button>
        </div>

        <Tabs defaultValue="wifi">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="wifi" data-ocid="admin.tab">
              <Wifi className="w-3.5 h-3.5" />
            </TabsTrigger>
            <TabsTrigger value="mobile" data-ocid="admin.tab">
              <Smartphone className="w-3.5 h-3.5" />
            </TabsTrigger>
            <TabsTrigger value="dish" data-ocid="admin.tab">
              <Tv className="w-3.5 h-3.5" />
            </TabsTrigger>
            <TabsTrigger value="bank" data-ocid="admin.tab">
              <Banknote className="w-3.5 h-3.5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wifi">
            <WifiBookingsTab />
          </TabsContent>
          <TabsContent value="mobile">
            <MobileRechargesTab />
          </TabsContent>
          <TabsContent value="dish">
            <DishRechargesTab />
          </TabsContent>
          <TabsContent value="bank">
            <PaymentBankTab />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function WifiBookingsTab() {
  const { data: bookings, isLoading } = useAllWifiBookings();
  if (isLoading) return <LoadingSkeleton />;
  if (!bookings?.length) return <EmptyState text="Koi WiFi booking nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {bookings.map((b: WifiBookingLead, i: number) => (
        <div
          key={b.id.toString()}
          data-ocid={`admin.item.${i + 1}`}
          className="border border-border rounded-xl p-3 space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">{b.customerName}</p>
            <StatusBadge status={b.status} />
          </div>
          <p className="text-xs text-muted-foreground">{b.mobileNumber}</p>
          <p className="text-xs text-muted-foreground">{b.fullAddress}</p>
          <p className="text-xs">
            <span className="text-muted-foreground">Service:</span>{" "}
            {b.serviceType}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(b.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function MobileRechargesTab() {
  const { data: recharges, isLoading } = useAllMobileRecharges();
  if (isLoading) return <LoadingSkeleton />;
  if (!recharges?.length)
    return <EmptyState text="Koi mobile recharge request nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {recharges.map((r: MobileRechargeLead, i: number) => (
        <div
          key={r.id.toString()}
          data-ocid={`admin.item.${i + 1}`}
          className="border border-border rounded-xl p-3 space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">{r.mobileNumber}</p>
            <StatusBadge status={r.status} />
          </div>
          <p className="text-xs">
            <span className="text-muted-foreground">Operator:</span>{" "}
            {r.operator}
          </p>
          <p className="text-xs">
            <span className="text-muted-foreground">Amount:</span> ₹{r.amount}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(r.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function DishRechargesTab() {
  const { data: recharges, isLoading } = useAllDishRecharges();
  if (isLoading) return <LoadingSkeleton />;
  if (!recharges?.length)
    return <EmptyState text="Koi Dish TV recharge request nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {recharges.map((r: DishTVRechargeLead, i: number) => (
        <div
          key={r.id.toString()}
          data-ocid={`admin.item.${i + 1}`}
          className="border border-border rounded-xl p-3 space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">ID: {r.customerId}</p>
            <StatusBadge status={r.status} />
          </div>
          <p className="text-xs">
            <span className="text-muted-foreground">Operator:</span>{" "}
            {r.operator}
          </p>
          <p className="text-xs">
            <span className="text-muted-foreground">Amount:</span> ₹{r.amount}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(r.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function PaymentBankTab() {
  const { data: requests, isLoading } = useAllPaymentBankRequests();
  if (isLoading) return <LoadingSkeleton />;
  if (!requests?.length)
    return <EmptyState text="Koi payment bank request nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {requests.map((r: PaymentBankServiceRequest, i: number) => (
        <div
          key={r.id.toString()}
          data-ocid={`admin.item.${i + 1}`}
          className="border border-border rounded-xl p-3 space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">{r.serviceOption}</p>
            <StatusBadge status={r.status} />
          </div>
          <p className="text-xs text-muted-foreground">{r.mobileNumber}</p>
          {r.notes && (
            <p className="text-xs">
              <span className="text-muted-foreground">Notes:</span> {r.notes}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDate(r.createdAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-green-100 text-green-700";
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {status}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3" data-ocid="admin.loading_state">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-10" data-ocid="admin.empty_state">
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  );
}
