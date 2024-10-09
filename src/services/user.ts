import { supabase } from "../utils/supabaseClient";

export const USER_SESSION = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error.message);
    return;
  }

  return session;
};

export const USER_ADD = async (datapost: any) => {
  const { data, error } = await supabase.from("users").insert([datapost]);
  if (error) {
    console.error("Error creating user data:", error.message);
  }

  return data;
};

export const USER_PROFILE_ADD = async (datapost: any) => {
  const { data, error } = await supabase.from("user_profile").insert([datapost]);
  if (error) {
    console.error("Error creating user profile data:", error.message);
  }

  return data;
};

export const USER_PROFILE_GET = async (user_id: string) => {
  const { data, error } = await supabase.from("user_profile").select("*").eq("user_id", user_id);
  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data;
};

export const USER_PROFILE_UPDATE = async (user_id: string, datapost: any) => {
  const result = await supabase.from("user_profile").update(datapost).eq("user_id", user_id);
  if (result.error) {
    console.error("Error updating user profile data:", result.error.message);
  }

  return result;
};

export const CHECK_EMAIL_EXISTS = async (email: string): Promise<boolean> => {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(checkError.message);
    }

    // return true if email found
    return !!existingUser;
  } catch (err: any) {
    return false;
  }
};

export const USER_UPLOAD_PROFILE_PHOTO = async (file: any) => {
  const { error } = await supabase.storage.from("profile_photos").upload(`profile/${file.name}`, file);

  if (error) {
    console.error("Error uploading file:", error.message);
    return null;
  }

  // get public url
  const {
    data: { publicUrl },
  }: { data: { publicUrl: string } } = supabase.storage.from("profile_photos").getPublicUrl(`profile/${file.name}`);

  if (!publicUrl) {
    console.error("Failed to get public URL");
    return null;
  }

  return publicUrl;
};
