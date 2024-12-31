import { supabase } from "@/lib/db";

// GET all agents or filtered agents if query params are provided
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let data, error;
    if (!id) {
      // Fetch all agents
      ({ data, error } = await supabase.from("agents").select("*"));
    } else if (id === "*") {
      // Handle wildcard requests (fetch all)
      ({ data, error } = await supabase.from("agents").select("*"));
    }

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return Response.json(
        { message: "No agents found", Error: true },
        { status: 404 }
      );
    }

    return Response.json({ Agents: data, Error: false }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Internal Server Error", Error: true },
      { status: 500 }
    );
  }
}

// POST a new agent
export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, hireDate } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !hireDate) {
      return Response.json(
        { message: "Bad request, all fields required!" },
        { status: 400 }
      );
    }

    // Generate a random agent ID
    const agent_id = Math.floor(Math.random() * 10000) + 1;

    const { data, error } = await supabase
      .from("agents")
      .insert([
        {
          id: agent_id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          hire_date: hireDate,
        },
      ])
      .select();

    if (error) {
      return Response.json(
        { message: "Insert failed", error: error.message },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Agent inserted successfully", error: false, Agent: data },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  }
}
