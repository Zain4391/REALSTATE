export async function ValidateClient(req, params) {
    const { id } = params; // Extract ID from params
  
    try {
      // Query the database
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("client_id", id)
        .single();
  
      // Handle errors
      if (error) {
        return { error: true, status: 500, message: error.message };
      }
  
      if (!data) {
        return { error: true, status: 404, message: "Client not found" };
      }
  
      // Return valid data
      return { error: false, data };
    } catch (err) {
      console.error(err.message);
      return { error: true, status: 500, message: "Internal Server Error" };
    }
  }