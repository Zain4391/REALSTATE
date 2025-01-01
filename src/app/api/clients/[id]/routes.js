import { supabase } from "@/lib/db";

export async function GET(req, { params }) {
    try {
      const validation = await ValidateClient(req, params);
  
      if (validation.error) {
        return Response.json(
          { message: validation.message, Error: true, status: validation.status }
        );
      }
  
      return Response.json(
        { message: "Client retrieved successfully", Error: false, Client: validation.data, status: 200 }
      );
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Internal Server Error", Error: true, status: 500 });
    }
  }
  
  // PUT - Update a client by ID
  export async function PUT(req, { params }) {
    try {
      const validation = await ValidateClient(req, params);
  
      if (validation.error) {
        return Response.json(
          { message: validation.message, Error: true, status: validation.status }
        );
      }
  
      const body = await req.json();
      const { first_name, last_name, email, phone, address, budget, preferences } = body;
  
      // Prepare updated values
      const updatedData = {
        first_name: first_name || validation.data.first_name,
        last_name: last_name || validation.data.last_name,
        email: email || validation.data.email,
        phone: phone || validation.data.phone,
        address: address || validation.data.address,
        budget: budget || validation.data.budget,
        preferences: preferences || validation.data.preferences,
      };
  
      const { error } = await supabase
        .from("clients")
        .update(updatedData)
        .eq("id", validation.data.id);
  
      if (error) {
        return Response.json(
          { message: "Failed to update client", Error: true, status: 500 }
        );
      }
  
      return Response.json(
        { message: "Client updated successfully", Error: false, status: 200 }
      );
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Internal Server Error", Error: true, status: 500 });
    }
  }
  
  // DELETE - Remove a client by ID
  export async function DELETE(req, { params }) {
    try {
      const validation = await ValidateClient(req, params);
  
      if (validation.error) {
        return Response.json(
          { message: validation.message, Error: true, status: validation.status }
        );
      }
  
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("client_id", validation.data.id);
  
      if (error) {
        return Response.json(
          { message: "Failed to delete client", Error: true, status: 500 }
        );
      }
  
      return Response.json(
        { message: "Client deleted successfully", Error: false, status: 204 }
      );
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Internal Server Error", Error: true, status: 500 });
    }
  }
  