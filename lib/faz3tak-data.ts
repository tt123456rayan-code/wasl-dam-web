"use client";

import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import type {
  ManualTerminalStatus,
  RequestView,
  RequesterPrivacyMode,
  RequestBloodType,
  UrgencyLevel,
} from "@/lib/faz3tak";

export { isSupabaseEnabled };

// تعذّر الاتصال بقاعدة البيانات (لم تُضبط المفاتيح)
export class DbNotConfiguredError extends Error {
  constructor() {
    super("db-not-configured");
    this.name = "DbNotConfiguredError";
  }
}

interface PublicRow {
  id: string;
  created_at: string;
  display_name: string;
  privacy_mode: RequesterPrivacyMode;
  hospital: string;
  governorate: string;
  blood_type: RequestBloodType;
  units_required: number;
  units_completed: number;
  urgency: UrgencyLevel;
  expiry: string;
  public_message: string;
  manual_status: ManualTerminalStatus | null;
  is_demo: boolean;
}

function mapRow(r: PublicRow): RequestView {
  return {
    id: r.id,
    createdAt: r.created_at,
    displayName: r.display_name,
    privacyMode: r.privacy_mode,
    hospital: r.hospital,
    governorate: r.governorate,
    bloodType: r.blood_type,
    unitsRequired: r.units_required,
    unitsCompleted: r.units_completed,
    urgency: r.urgency,
    expiry: r.expiry,
    publicMessage: r.public_message,
    manualStatus: r.manual_status,
    isDemo: r.is_demo,
  };
}

export async function listRequests(): Promise<RequestView[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("faz3_requests_public")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PublicRow[]).map(mapRow);
}

export async function getRequestView(id: string): Promise<RequestView | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("faz3_requests_public")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as PublicRow) : null;
}

export interface UpdateRow {
  at: string;
  type: string;
  message: string;
}

export async function getUpdates(id: string): Promise<UpdateRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc("faz3_get_updates", { p_ref: id });
  if (error) throw error;
  return (data ?? []) as UpdateRow[];
}

export interface CreateInput {
  fullName: string;
  privacy: RequesterPrivacyMode;
  mobile: string;
  hospital: string;
  governorate: string;
  bloodType: RequestBloodType;
  units: number;
  urgency: UrgencyLevel;
  expiry: string; // ISO
  message: string;
}

export async function createRequest(
  input: CreateInput
): Promise<{ id: string; token: string }> {
  if (!supabase) throw new DbNotConfiguredError();
  const { data, error } = await supabase.rpc("faz3_create_request", {
    p_full_name: input.fullName,
    p_privacy: input.privacy,
    p_mobile: input.mobile,
    p_hospital: input.hospital,
    p_governorate: input.governorate,
    p_blood_type: input.bloodType,
    p_units: input.units,
    p_urgency: input.urgency,
    p_expiry: input.expiry,
    p_message: input.message,
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return { id: row.id, token: row.token };
}

export async function updateCount(ref: string, token: string, completed: number) {
  if (!supabase) throw new DbNotConfiguredError();
  const { error } = await supabase.rpc("faz3_update_count", {
    p_ref: ref,
    p_token: token,
    p_completed: completed,
  });
  if (error) throw error;
}

export async function addNote(ref: string, token: string, note: string) {
  if (!supabase) throw new DbNotConfiguredError();
  const { error } = await supabase.rpc("faz3_add_note", { p_ref: ref, p_token: token, p_note: note });
  if (error) throw error;
}

export async function setUrgency(ref: string, token: string, urgency: UrgencyLevel) {
  if (!supabase) throw new DbNotConfiguredError();
  const { error } = await supabase.rpc("faz3_set_urgency", { p_ref: ref, p_token: token, p_urgency: urgency });
  if (error) throw error;
}

export async function extendExpiry(ref: string, token: string, expiry: string) {
  if (!supabase) throw new DbNotConfiguredError();
  const { error } = await supabase.rpc("faz3_extend_expiry", { p_ref: ref, p_token: token, p_expiry: expiry });
  if (error) throw error;
}

export async function setStatus(ref: string, token: string, status: ManualTerminalStatus) {
  if (!supabase) throw new DbNotConfiguredError();
  const { error } = await supabase.rpc("faz3_set_status", { p_ref: ref, p_token: token, p_status: status });
  if (error) throw error;
}

export async function addReport(ref: string, reason: string) {
  if (!supabase) throw new DbNotConfiguredError();
  const { error } = await supabase.rpc("faz3_add_report", { p_ref: ref, p_reason: reason });
  if (error) throw error;
}
