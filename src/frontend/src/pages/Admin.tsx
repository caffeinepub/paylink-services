import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LogIn,
  LogOut,
  RefreshCw,
  Smartphone,
  Tv,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import { AppLayout, PageHeader } from "../components/AppLayout";
import { useActor } from "../hooks/useActor";
import type {
  DishTVRechargeLead,
  MobileRechargeLead,
  PaymentBankServiceRequest,
  WifiBookingLead,
} from "../hooks/useQueries";

const ADMIN_SESSION_KEY = "adminLoggedIn";
const ADMIN_PASSWORD = "Vasu1179";

function formatDate(bigintTs: bigint) {
  const ms = Number(bigintTs) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBlobUrl(blob: any): string | null {
  if (!blob) return null;
  if (typeof blob.directURL === "string" && blob.directURL)
    return blob.directURL;
  if (typeof blob.getDirectURL === "function") {
    try {
      const url = blob.getDirectURL();
      if (typeof url === "string" && url) return url;
    } catch {
      // ignore
    }
  }
  return null;
}

function ScreenshotImage({ blob, label }: { blob: any; label: string }) {
  const url = getBlobUrl(blob);
  if (!url) return null;
  return (
    <div className="mt-2">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={url}
          alt={label}
          className="w-full max-h-48 object-contain rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
        />
        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Full screen mein dekho
        </p>
      </a>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-8 space-y-3" data-ocid="admin.error_state">
      <p className="text-red-500 text-sm font-medium">
        Data load karne mein error aaya
      </p>
      <p className="text-xs text-muted-foreground break-all px-2">{error}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="w-3.5 h-3.5 mr-1" /> Dobara Try Karen
      </Button>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );
  const queryClient = useQueryClient();

  const handleLogin = () => {
    if (!password.trim()) {
      setError("Password darj karein");
      return;
    }
    if (password.trim() === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Password galat hai. Dobara try karein.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsLoggedIn(false);
    setPassword("");
  };

  const handleRefresh = async () => {
    const keys = [
      "pwdWifiBookings",
      "pwdMobileRecharges",
      "pwdDishRecharges",
      "pwdPaymentBank",
    ];
    await queryClient.invalidateQueries();
    await Promise.all(
      keys.map((key) => queryClient.refetchQueries({ queryKey: [key] })),
    );
  };

  if (!isLoggedIn) {
    return (
      <AppLayout>
        <PageHeader title="Admin Panel" />
        <div className="px-4 py-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Wifi className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Admin Login</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Saare leads dekhne ke liye password darj karein
          </p>
          <div className="w-full mt-6 text-left">
            <Label htmlFor="admin-password" className="text-sm font-medium">
              Admin Password
            </Label>
            <Input
              id="admin-password"
              data-ocid="admin.input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password darj karein"
              className="mt-1.5 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          </div>
          <Button
            data-ocid="admin.primary_button"
            className="mt-4 w-full bg-primary text-white hover:bg-primary/90 rounded-xl py-3 font-bold"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login Karen
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              data-ocid="admin.secondary_button"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
            </Button>
          </div>
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
  const { actor, isFetching } = useActor();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const {
    data: bookings,
    isLoading,
    isFetching: isQueryFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pwdWifiBookings"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getWifiBookingsWithPassword(ADMIN_PASSWORD);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });
  if (isLoading || isQueryFetching) return <LoadingSkeleton />;
  if (isError)
    return <ErrorState error={String(error)} onRetry={() => refetch()} />;
  if (!bookings?.length) return <EmptyState text="Koi WiFi booking nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {bookings.map((b: WifiBookingLead, i: number) => {
        const id = b.id.toString();
        const isExpanded = expandedId === id;
        const hasScreenshot = !!getBlobUrl(b.paymentScreenshotFile);
        const hasAadhaar =
          !!getBlobUrl(b.aadhaarFrontFile) || !!getBlobUrl(b.aadhaarBackFile);
        return (
          <div
            key={id}
            data-ocid={`admin.item.${i + 1}`}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              type="button"
              className="w-full text-left p-3 space-y-1"
              onClick={() => setExpandedId(isExpanded ? null : id)}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{b.customerName}</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{b.mobileNumber}</p>
              <p className="text-xs text-muted-foreground">{b.fullAddress}</p>
              {!isExpanded && (hasScreenshot || hasAadhaar) && (
                <p className="text-xs text-blue-500 font-medium">
                  📎 Files attached — tap to view
                </p>
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 border-t border-border pt-3 space-y-2">
                {(b.latitude || b.googleMapsLink) && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 space-y-0.5">
                    {b.latitude && b.longitude && (
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Lat:</span> {b.latitude}{" "}
                        <span className="font-medium">Long:</span> {b.longitude}
                      </p>
                    )}
                    {b.googleMapsLink && (
                      <a
                        href={b.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Google Maps
                      </a>
                    )}
                  </div>
                )}
                <p className="text-xs">
                  <span className="text-muted-foreground">Service:</span>{" "}
                  {b.serviceType}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(b.createdAt)}
                </p>
                {b.paymentScreenshotFile && (
                  <ScreenshotImage
                    blob={b.paymentScreenshotFile}
                    label="Payment Screenshot"
                  />
                )}
                {b.aadhaarFrontFile && (
                  <ScreenshotImage
                    blob={b.aadhaarFrontFile}
                    label="Aadhaar Front"
                  />
                )}
                {b.aadhaarBackFile && (
                  <ScreenshotImage
                    blob={b.aadhaarBackFile}
                    label="Aadhaar Back"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MobileRechargesTab() {
  const { actor, isFetching } = useActor();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const {
    data: recharges,
    isLoading,
    isFetching: isQueryFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pwdMobileRecharges"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getMobileRechargesWithPassword(ADMIN_PASSWORD);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });
  if (isLoading || isQueryFetching) return <LoadingSkeleton />;
  if (isError)
    return <ErrorState error={String(error)} onRetry={() => refetch()} />;
  if (!recharges?.length)
    return <EmptyState text="Koi mobile recharge request nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {recharges.map((r: MobileRechargeLead, i: number) => {
        const id = r.id.toString();
        const isExpanded = expandedId === id;
        const hasScreenshot = !!getBlobUrl(r.paymentScreenshotFile);
        return (
          <div
            key={id}
            data-ocid={`admin.item.${i + 1}`}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              type="button"
              className="w-full text-left p-3 space-y-1"
              onClick={() => setExpandedId(isExpanded ? null : id)}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{r.mobileNumber}</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p className="text-xs">
                <span className="text-muted-foreground">Operator:</span>{" "}
                {r.operator}
              </p>
              <p className="text-xs">
                <span className="text-muted-foreground">Amount:</span> ₹
                {r.amount}
              </p>
              {!isExpanded && hasScreenshot && (
                <p className="text-xs text-blue-500 font-medium">
                  📎 Payment screenshot attached — tap to view
                </p>
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 border-t border-border pt-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {formatDate(r.createdAt)}
                </p>
                {r.paymentScreenshotFile && (
                  <ScreenshotImage
                    blob={r.paymentScreenshotFile}
                    label="Payment Screenshot"
                  />
                )}
                {!hasScreenshot && (
                  <p className="text-xs text-muted-foreground italic">
                    Koi payment screenshot nahi hai
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DishRechargesTab() {
  const { actor, isFetching } = useActor();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const {
    data: recharges,
    isLoading,
    isFetching: isQueryFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pwdDishRecharges"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getDishRechargesWithPassword(ADMIN_PASSWORD);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });
  if (isLoading || isQueryFetching) return <LoadingSkeleton />;
  if (isError)
    return <ErrorState error={String(error)} onRetry={() => refetch()} />;
  if (!recharges?.length)
    return <EmptyState text="Koi Dish TV recharge request nahi hai" />;
  return (
    <div className="space-y-3" data-ocid="admin.list">
      {recharges.map((r: DishTVRechargeLead, i: number) => {
        const id = r.id.toString();
        const isExpanded = expandedId === id;
        const hasScreenshot = !!getBlobUrl(r.paymentScreenshotFile);
        return (
          <div
            key={id}
            data-ocid={`admin.item.${i + 1}`}
            className="border border-border rounded-xl overflow-hidden"
          >
            <button
              type="button"
              className="w-full text-left p-3 space-y-1"
              onClick={() => setExpandedId(isExpanded ? null : id)}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">ID: {r.customerId}</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p className="text-xs">
                <span className="text-muted-foreground">Operator:</span>{" "}
                {r.operator}
              </p>
              <p className="text-xs">
                <span className="text-muted-foreground">Amount:</span> ₹
                {r.amount}
              </p>
              {!isExpanded && hasScreenshot && (
                <p className="text-xs text-blue-500 font-medium">
                  📎 Payment screenshot attached — tap to view
                </p>
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 border-t border-border pt-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {formatDate(r.createdAt)}
                </p>
                {r.paymentScreenshotFile && (
                  <ScreenshotImage
                    blob={r.paymentScreenshotFile}
                    label="Payment Screenshot"
                  />
                )}
                {!hasScreenshot && (
                  <p className="text-xs text-muted-foreground italic">
                    Koi payment screenshot nahi hai
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PaymentBankTab() {
  const { actor, isFetching } = useActor();
  const {
    data: requests,
    isLoading,
    isFetching: isQueryFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pwdPaymentBank"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getPaymentBankRequestsWithPassword(ADMIN_PASSWORD);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
  });
  if (isLoading || isQueryFetching) return <LoadingSkeleton />;
  if (isError)
    return <ErrorState error={String(error)} onRetry={() => refetch()} />;
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
