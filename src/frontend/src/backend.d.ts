import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MobileRechargeLead {
    id: bigint;
    status: string;
    paymentScreenshotFile?: ExternalBlob;
    operator: string;
    createdAt: bigint;
    mobileNumber: string;
    amount: string;
}
export interface DishTVRechargeLead {
    id: bigint;
    status: string;
    paymentScreenshotFile?: ExternalBlob;
    operator: string;
    createdAt: bigint;
    customerId: string;
    amount: string;
}
export interface PaymentBankServiceRequest {
    id: bigint;
    status: string;
    createdAt: bigint;
    mobileNumber: string;
    notes: string;
    serviceOption: string;
}
export interface WifiBookingLead {
    id: bigint;
    customerName: string;
    status: string;
    serviceType: string;
    paymentScreenshotFile?: ExternalBlob;
    createdAt: bigint;
    mobileNumber: string;
    aadhaarBackFile?: ExternalBlob;
    fullAddress: string;
    aadhaarFrontFile?: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllDishTVRechargeLeads(): Promise<Array<DishTVRechargeLead>>;
    getAllMobileRechargeLeads(): Promise<Array<MobileRechargeLead>>;
    getAllPaymentBankServiceRequests(): Promise<Array<PaymentBankServiceRequest>>;
    /**
     * / Admin-only: Get all leads
     */
    getAllWifiBookingLeads(): Promise<Array<WifiBookingLead>>;
    getApprovedMobileRechargeLeads(): Promise<Array<MobileRechargeLead>>;
    getApprovedWifiBookingLeads(): Promise<Array<WifiBookingLead>>;
    /**
     * / User Profile Management
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingMobileRechargeLeads(): Promise<Array<MobileRechargeLead>>;
    /**
     * / Admin-only: Query functions for status specific leads
     */
    getPendingWifiBookingLeads(): Promise<Array<WifiBookingLead>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDishTVRechargeLead(customerId: string, operator: string, amount: string, paymentScreenshotFile: ExternalBlob | null): Promise<bigint>;
    submitMobileRechargeLead(mobileNumber: string, operator: string, amount: string, paymentScreenshotFile: ExternalBlob | null): Promise<bigint>;
    submitPaymentBankServiceRequest(serviceOption: string, mobileNumber: string, notes: string): Promise<bigint>;
    /**
     * / Create new lead - Public, no auth required for customers to submit
     */
    submitWifiBookingLead(customerName: string, mobileNumber: string, fullAddress: string, serviceType: string, aadhaarFrontFile: ExternalBlob | null, aadhaarBackFile: ExternalBlob | null, paymentScreenshotFile: ExternalBlob | null): Promise<bigint>;
    updateDishTVRechargeLeadStatus(leadId: bigint, newStatus: string): Promise<void>;
    updateMobileRechargeLeadStatus(leadId: bigint, newStatus: string): Promise<void>;
    updatePaymentBankServiceRequestStatus(leadId: bigint, newStatus: string): Promise<void>;
    /**
     * / Admin-only: Update lead status
     */
    updateWifiBookingLeadStatus(leadId: bigint, newStatus: string): Promise<void>;
}
