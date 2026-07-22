import { supabase, type AppUser } from "@/integrations/supabase/client";

async function assertAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Forbidden: admin only");

  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") throw new Error("Forbidden: admin only");
}

export async function listUsers() {
  await assertAdmin();
  const { data: users, error } = await supabase.from("users").select("*").order("id");
  if (error) throw error;

  return (users || []).map((user) => ({
    id: user.id,
    email: user.email ?? "",
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastSignInAt: null,
    provider: "email",
    roles: user.role ? [user.role] : ["user"],
    disabled: user.disabled || false,
    fullName: user.full_name ?? "",
    phone: user.phone ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    addressLine1: user.address_line1 ?? "",
    postalCode: user.postal_code ?? "",
  }));
}

export async function setUserRole({
  data,
}: {
  data: { userId: string; role: "admin" | "user"; grant: boolean };
}) {
  await assertAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ownerEmail = process.env.VITE_OWNER_EMAIL;
  
  if (user?.email !== ownerEmail) {
    throw new Error("Only the owner can manage admin roles");
  }

  if (!data.grant && data.role === "admin" && data.userId === user?.id) {
    throw new Error("You cannot remove your own admin role");
  }

  const { data: targetUser } = await supabase.from("users").select("email").eq("id", data.userId).single();
  if (targetUser?.email === ownerEmail && !data.grant) {
    throw new Error("You cannot demote the owner");
  }
  const { error } = await supabase
    .from("users")
    .update({ role: data.grant ? data.role : "user" })
    .eq("id", data.userId);
  if (error) throw error;
  return { ok: true };
}

export async function deleteUser({ data }: { data: { userId: string } }) {
  await assertAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (data.userId === user?.id) throw new Error("You cannot delete your own account");

  const ownerEmail = process.env.VITE_OWNER_EMAIL;
  const { data: targetUser } = await supabase.from("users").select("email").eq("id", data.userId).single();
  if (ownerEmail && targetUser?.email === ownerEmail) {
    throw new Error("You cannot delete the owner account");
  }

  const { error } = await supabase.from("users").delete().eq("id", data.userId);
  if (error) throw error;
  return { ok: true };
}

export async function setUserDisabled({ data }: { data: { userId: string; disabled: boolean } }) {
  await assertAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (data.userId === user?.id) throw new Error("You cannot disable your own account");

  const ownerEmail = process.env.VITE_OWNER_EMAIL;
  const { data: targetUser } = await supabase.from("users").select("email").eq("id", data.userId).single();
  if (ownerEmail && targetUser?.email === ownerEmail && data.disabled) {
    throw new Error("You cannot disable the owner account");
  }

  const { error } = await supabase
    .from("users")
    .update({ disabled: data.disabled })
    .eq("id", data.userId);
  if (error) throw error;
  return { ok: true };
}

export async function updateUserProfile({
  data,
}: {
  data: {
    userId: string;
    fullName?: string;
    phone?: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
}) {
  await assertAdmin();
  const { userId, ...profile } = data;

  const dbData: any = {};
  if (profile.fullName !== undefined) dbData.full_name = profile.fullName;
  if (profile.phone !== undefined) dbData.phone = profile.phone;
  if (profile.addressLine1 !== undefined) dbData.address_line1 = profile.addressLine1;
  if (profile.city !== undefined) dbData.city = profile.city;
  if (profile.state !== undefined) dbData.state = profile.state;
  if (profile.postalCode !== undefined) dbData.postal_code = profile.postalCode;

  const { error } = await supabase.from("users").update(dbData).eq("id", userId);
  if (error) throw error;
  return { ok: true };
}
