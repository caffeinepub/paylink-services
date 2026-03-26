import type { Principal } from '@dfinity/principal';
export interface ExternalBlob {
    fromBytes(bytes: Uint8Array): ExternalBlob;
    toBytes(): Uint8Array;
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
    latitude?: string;
    longitude?: string;
    googleMapsLink?: string;
    aadhaarFrontFile?: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = 'admin',
    user = 'user',
}
export interface MobileRechargeLead {
    id: bigint;
    mobileNumber: string;
    operator: string;
    amount: string;
    paymentScreenshotFile?: ExternalBlob;
    status: string;
    createdAt: bigint;
}
export interface DishTVRechargeLead {
    id: bigint;
    customerId: string;
    operator: string;
    amount: string;
    paymentScreenshotFile?: ExternalBlob;
    status: string;
    createdAt: bigint;
}
export interface PaymentBankServiceRequest {
    id: bigint;
    serviceOption: string;
    mobileNumber: string;
    notes: string;
    status: string;
    createdAt: bigint;
}
export interface Actor {
    setupAdminDirectly(password: string): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    getAllWifiBookingLeads(): Promise<Array<WifiBookingLead>>;
    getDishRechargesWithPassword(password: string): Promise<Array<DishTVRechargeLead>>;
    getMobileRechargesWithPassword(password: string): Promise<Array<MobileRechargeLead>>;
    getPaymentBankRequestsWithPassword(password: string): Promise<Array<PaymentBankServiceRequest>>;
    getWifiBookingsWithPassword(password: string): Promise<Array<WifiBookingLead>>;
    getApprovedMobileRechargeLeads(): Promise<Array<MobileRechargeLead>>;
    getApprovedWifiBookingLeads(): Promise<Array<WifiBookingLead>>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingMobileRechargeLeads(): Promise<Array<MobileRechargeLead>>;
    getPendingWifiBookingLeads(): Promise<Array<WifiBookingLead>>;
    isCallerAdmin(): Promise<boolean>;
    submitDishTVRechargeLead(customerId: string, operator: string, amount: string, paymentScreenshotFile: ExternalBlob | null): Promise<bigint>;
    submitMobileRechargeLead(mobileNumber: string, operator: string, amount: string, paymentScreenshotFile: ExternalBlob | null): Promise<bigint>;
    submitPaymentBankServiceRequest(serviceOption: string, mobileNumber: string, notes: string): Promise<bigint>;
    submitWifiBookingLead(customerName: string, mobileNumber: string, fullAddress: string, serviceType: string, aadhaarFrontFile: ExternalBlob | null, aadhaarBackFile: ExternalBlob | null, paymentScreenshotFile: ExternalBlob | null, latitude: string | null, longitude: string | null, googleMapsLink: string | null): Promise<bigint>;
    updateDishTVRechargeLeadStatus(leadId: bigint, newStatus: string): Promise<void>;
    updateMobileRechargeLeadStatus(leadId: bigint, newStatus: string): Promise<void>;
    updatePaymentBankServiceRequestStatus(leadId: bigint, newStatus: string): Promise<void>;
    updateWifiBookingLeadStatus(leadId: bigint, newStatus: string): Promise<void>;
}
