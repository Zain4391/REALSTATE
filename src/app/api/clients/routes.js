import { supabase } from "@/lib/db";
import bcrypt from "bcrypt"

export async function GET(req) {
    try {
      const { data, error } = await supabase.from("clients").select("*");
  
      if (error) {
        return Response.json({ message: error.message, Error: true, status: 500 });
      }
  
      return Response.json({ message: "Clients retrieved successfully", Error: false, Clients: data, status: 200 });
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Internal Server Error", Error: true, status: 500 });
    }
  }
  
  export async function POST(req) {
    try {
      const body = await req.json();
      const { first_name, last_name, email, phone, address, budget, preferences, password } = body;
  
      // Validate required fields
      if (!first_name || !last_name || !email || !phone || !password) {
        return Response.json({ message: "Missing required fields", Error: true, status: 400 });
      }
  
      // Generate random integer client ID
      const client_id = Math.floor(Math.random() * 1000) + 1;
  
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert data into the database
      const { data, error } = await supabase.from("clients").insert([
        {
          client_id,
          first_name,
          last_name,
          email,
          phone,
          address,
          budget,
          preferences,
          password: hashedPassword,
        },
      ]);
  
      if (error) {
        return Response.json({ message: error.message, Error: true, status: 500 });
      }
  
      return Response.json({ message: "Client created successfully", Error: false, Client: data, status: 201 });
    } catch (err) {
      console.error(err);
      return Response.json({ message: "Internal Server Error", Error: true, status: 500 });
    }
  }
  