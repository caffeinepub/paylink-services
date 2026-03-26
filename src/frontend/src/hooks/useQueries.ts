import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type {
  DishTVRechargeLead,
  MobileRechargeLead,
  PaymentBankServiceRequest,
  WifiBookingLead,
} from "../backend";
import { useActor } from "./useActor";

export type {
  WifiBookingLead,
  MobileRechargeLead,
  DishTVRechargeLead,
  PaymentBankServiceRequest,
};

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllWifiBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allWifiBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWifiBookingLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllMobileRecharges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allMobileRecharges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMobileRechargeLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDishRecharges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDishRecharges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDishTVRechargeLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllPaymentBankRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allPaymentBankRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPaymentBankServiceRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitWifiBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      mobileNumber: string;
      fullAddress: string;
      serviceType: string;
      aadhaarFront: ExternalBlob | null;
      aadhaarBack: ExternalBlob | null;
      paymentScreenshot: ExternalBlob | null;
      latitude: string | null;
      longitude: string | null;
      googleMapsLink: string | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitWifiBookingLead(
        data.customerName,
        data.mobileNumber,
        data.fullAddress,
        data.serviceType,
        data.aadhaarFront,
        data.aadhaarBack,
        data.paymentScreenshot,
        data.latitude,
        data.longitude,
        data.googleMapsLink,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allWifiBookings"] });
    },
  });
}

export function useSubmitMobileRecharge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      mobileNumber: string;
      operator: string;
      amount: string;
      paymentScreenshot: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitMobileRechargeLead(
        data.mobileNumber,
        data.operator,
        data.amount,
        data.paymentScreenshot,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allMobileRecharges"] });
    },
  });
}

export function useSubmitDishRecharge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerId: string;
      operator: string;
      amount: string;
      paymentScreenshot: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitDishTVRechargeLead(
        data.customerId,
        data.operator,
        data.amount,
        data.paymentScreenshot,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDishRecharges"] });
    },
  });
}

export function useSubmitPaymentBank() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      serviceOption: string;
      mobileNumber: string;
      notes: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitPaymentBankServiceRequest(
        data.serviceOption,
        data.mobileNumber,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPaymentBankRequests"] });
    },
  });
}
