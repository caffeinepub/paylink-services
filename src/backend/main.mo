import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module WifiBookingLead {
    public func compare(lead1 : WifiBookingLead, lead2 : WifiBookingLead) : Order.Order {
      Nat.compare(lead1.id, lead2.id);
    };
  };

  module MobileRechargeLead {
    public func compare(lead1 : MobileRechargeLead, lead2 : MobileRechargeLead) : Order.Order {
      Nat.compare(lead1.id, lead2.id);
    };
  };

  module DishTVRechargeLead {
    public func compare(lead1 : DishTVRechargeLead, lead2 : DishTVRechargeLead) : Order.Order {
      Nat.compare(lead1.id, lead2.id);
    };
  };

  module PaymentBankServiceRequest {
    public func compare(lead1 : PaymentBankServiceRequest, lead2 : PaymentBankServiceRequest) : Order.Order {
      Nat.compare(lead1.id, lead2.id);
    };
  };

  type WifiBookingLead = {
    id : Nat;
    customerName : Text;
    mobileNumber : Text;
    fullAddress : Text;
    serviceType : Text;
    aadhaarFrontFile : ?Storage.ExternalBlob;
    aadhaarBackFile : ?Storage.ExternalBlob;
    paymentScreenshotFile : ?Storage.ExternalBlob;
    status : Text;
    createdAt : Int;
  };

  type MobileRechargeLead = {
    id : Nat;
    mobileNumber : Text;
    operator : Text;
    amount : Text;
    paymentScreenshotFile : ?Storage.ExternalBlob;
    status : Text;
    createdAt : Int;
  };

  type DishTVRechargeLead = {
    id : Nat;
    customerId : Text;
    operator : Text;
    amount : Text;
    paymentScreenshotFile : ?Storage.ExternalBlob;
    status : Text;
    createdAt : Int;
  };

  type PaymentBankServiceRequest = {
    id : Nat;
    serviceOption : Text;
    mobileNumber : Text;
    notes : Text;
    status : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let wifiBookingLeads = Map.empty<Nat, WifiBookingLead>();
  let mobileRechargeLeads = Map.empty<Nat, MobileRechargeLead>();
  let dishTVRechargeLeads = Map.empty<Nat, DishTVRechargeLead>();
  let paymentBankServiceRequests = Map.empty<Nat, PaymentBankServiceRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextLeadId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  /// User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// Create new lead - Public, no auth required for customers to submit
  public shared ({ caller }) func submitWifiBookingLead(customerName : Text, mobileNumber : Text, fullAddress : Text, serviceType : Text, aadhaarFrontFile : ?Storage.ExternalBlob, aadhaarBackFile : ?Storage.ExternalBlob, paymentScreenshotFile : ?Storage.ExternalBlob) : async Nat {
    let id = nextLeadId;
    wifiBookingLeads.add(
      id,
      {
        id;
        customerName;
        mobileNumber;
        fullAddress;
        serviceType;
        aadhaarFrontFile;
        aadhaarBackFile;
        paymentScreenshotFile;
        status = "Pending";
        createdAt = Time.now();
      },
    );
    nextLeadId += 1;
    id;
  };

  public shared ({ caller }) func submitMobileRechargeLead(mobileNumber : Text, operator : Text, amount : Text, paymentScreenshotFile : ?Storage.ExternalBlob) : async Nat {
    let id = nextLeadId;
    mobileRechargeLeads.add(
      id,
      {
        id;
        mobileNumber;
        operator;
        amount;
        paymentScreenshotFile;
        status = "Pending";
        createdAt = Time.now();
      },
    );
    nextLeadId += 1;
    id;
  };

  public shared ({ caller }) func submitDishTVRechargeLead(customerId : Text, operator : Text, amount : Text, paymentScreenshotFile : ?Storage.ExternalBlob) : async Nat {
    let id = nextLeadId;
    dishTVRechargeLeads.add(
      id,
      {
        id;
        customerId;
        operator;
        amount;
        paymentScreenshotFile;
        status = "Pending";
        createdAt = Time.now();
      },
    );
    nextLeadId += 1;
    id;
  };

  public shared ({ caller }) func submitPaymentBankServiceRequest(serviceOption : Text, mobileNumber : Text, notes : Text) : async Nat {
    let id = nextLeadId;
    paymentBankServiceRequests.add(
      id,
      {
        id;
        serviceOption;
        mobileNumber;
        notes;
        status = "Pending";
        createdAt = Time.now();
      },
    );
    nextLeadId += 1;
    id;
  };

  /// Admin-only: Update lead status
  public shared ({ caller }) func updateWifiBookingLeadStatus(leadId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lead status");
    };
    let existing = switch (wifiBookingLeads.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?l) { l };
    };
    let updatedLead = {
      existing with
      status = newStatus;
    };
    wifiBookingLeads.add(leadId, updatedLead);
  };

  public shared ({ caller }) func updateMobileRechargeLeadStatus(leadId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lead status");
    };
    let existing = switch (mobileRechargeLeads.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?l) { l };
    };
    let updatedLead = {
      existing with
      status = newStatus;
    };
    mobileRechargeLeads.add(leadId, updatedLead);
  };

  public shared ({ caller }) func updateDishTVRechargeLeadStatus(leadId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lead status");
    };
    let existing = switch (dishTVRechargeLeads.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?l) { l };
    };
    let updatedLead = {
      existing with
      status = newStatus;
    };
    dishTVRechargeLeads.add(leadId, updatedLead);
  };

  public shared ({ caller }) func updatePaymentBankServiceRequestStatus(leadId : Nat, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lead status");
    };
    let existing = switch (paymentBankServiceRequests.get(leadId)) {
      case (null) { Runtime.trap("Lead not found") };
      case (?l) { l };
    };
    let updatedLead = {
      existing with
      status = newStatus;
    };
    paymentBankServiceRequests.add(leadId, updatedLead);
  };

  /// Admin-only: Get all leads
  public query ({ caller }) func getAllWifiBookingLeads() : async [WifiBookingLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all leads");
    };
    wifiBookingLeads.values().toArray().sort();
  };

  public query ({ caller }) func getAllMobileRechargeLeads() : async [MobileRechargeLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all leads");
    };
    mobileRechargeLeads.values().toArray().sort();
  };

  public query ({ caller }) func getAllDishTVRechargeLeads() : async [DishTVRechargeLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all leads");
    };
    dishTVRechargeLeads.values().toArray().sort();
  };

  public query ({ caller }) func getAllPaymentBankServiceRequests() : async [PaymentBankServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all leads");
    };
    paymentBankServiceRequests.values().toArray().sort();
  };

  /// Admin-only: Query functions for status specific leads
  public query ({ caller }) func getPendingWifiBookingLeads() : async [WifiBookingLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch leads");
    };
    wifiBookingLeads.values().filter(func(lead) { lead.status == "Pending" }).toArray().sort();
  };

  public query ({ caller }) func getApprovedWifiBookingLeads() : async [WifiBookingLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch leads");
    };
    wifiBookingLeads.values().filter(func(lead) { lead.status == "Approved" }).toArray().sort();
  };

  public query ({ caller }) func getPendingMobileRechargeLeads() : async [MobileRechargeLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch leads");
    };
    mobileRechargeLeads.values().filter(func(lead) { lead.status == "Pending" }).toArray().sort();
  };

  public query ({ caller }) func getApprovedMobileRechargeLeads() : async [MobileRechargeLead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch leads");
    };
    mobileRechargeLeads.values().filter(func(lead) { lead.status == "Approved" }).toArray().sort();
  };

  /// General file storage mixin
  include MixinStorage();
};
