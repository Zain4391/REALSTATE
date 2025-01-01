import { supabase } from "@/lib/db";

export async function validateAgentId(req, params) {
  const { id } = await params; // Get the ID from params

  try {
    // Query the database
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single();

    // Handle errors
    if (error) {
      return { error: true, status: 500, message: error.message };
    }

    if (!data) {
      return { error: true, status: 404, message: "Agent not found" };
    }

    // Return valid data
    return { error: false, data };
  } catch (err) {
    console.error(err.message);
    return { error: true, status: 500, message: "Internal Server Error" };
  }
}
