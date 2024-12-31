import { supabase } from "@/lib/db";

// GET an agent by ID
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) {
      return Response.json(
        { message: "No agent found", error: true },
        { status: 404 }
      );
    }

    if (error) {
      return Response.json(
        { message: "Error fetching agent", error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Internal Server Error", Error: true },
      { status: 500 }
    );
  }
}

// PUT - Update an agent by ID
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    // Check if the agent exists
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) {
      return Response.json(
        { message: "No agent found", error: true },
        { status: 404 }
      );
    }

    if (error) {
      return Response.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }

    // Prepare updated values
    const updatedData = {
      first_name: firstName || data.first_name,
      last_name: lastName || data.last_name,
      email: email || data.email,
      phone: phone || data.phone,
    };

    const { error: updateError } = await supabase
      .from("agents")
      .update(updatedData)
      .eq("id", id);

    if (updateError) {
      return Response.json(
        { message: "Failed to update agent", error: updateError.message },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Agent updated successfully", data: updatedData },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  }
}

// DELETE - Remove an agent by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", id);

    if (error) {
      return Response.json(
        { message: error.message, error: true },
        { status: 500 }
      );
    }

    if (!data) {
      return Response.json(
        { message: "No agent found", error: true },
        { status: 404 }
      );
    }

    const { error: DelError } = await supabase
      .from("agents")
      .delete()
      .eq("id", id);

    if (DelError) {
      return Response.json(
        { message: "Failed to delete agent", error: true },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Agent deleted successfully", error: false },
      { status: 204 }
    );
  } catch (error) {
    console.log(error.message);
    return Response.json(
      { message: "Internal server error", error: true },
      { status: 500 }
    );
  }
}
