import { supabase } from "@/lib/db";
import { validateAgentId } from "@/middleware/agentValidation";

// GET an agent by ID
export async function GET(req, { params }) {
  try {
    const validation = await validateAgentId(req, params);

    if(validation.error) {
      return Response.json({message:validation.message, Error: true, Agents: null, status: validation.status});
    }

    return Response.json({message: validation.message, Error: false, Agents: validation.data, status: validation.status});
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Internal Server Error", Error: true ,
       status: 500 
      }
    );
  }
}

// PUT - Update an agent by ID
export async function PUT(req, { params }) {
  try {
    const validation = await validateAgentId(req, params);

    if(validation.error) {
      return Response.json({message:validation.message, Error: true, Agents: null, status: validation.status});
    }

    const body = await req.json();
    const { firstName, lastName, email, phone } = body;

    // Prepare updated values
    const updatedData = {
      first_name: firstName || validation.data.first_name,
      last_name: lastName || validation.data.last_name,
      email: email || validation.data.email,
      phone: phone || validation.data.phone,
    };

    const { error: updateError } = await supabase
      .from("agents")
      .update(updatedData)
      .eq("id", validation.data.id);

    if (updateError) {
      return Response.json(
        { message: "Failed to update agent", error: updateError.message ,
         status: 500 }
      );
    }

    return Response.json(
      { message: "Agent updated successfully", data: updatedData ,
      status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Internal server error", error: true ,
      status: 500 }
    );
  }
}

// DELETE - Remove an agent by ID
export async function DELETE(req, { params }) {
  try {
    const validation = await validateAgentId(req, params);

    if(validation.error) {
      return Response.json({message:validation.message, Error: true, Agents: null, status: validation.status});
    }

    const { error: DelError } = await supabase
      .from("agents")
      .delete()
      .eq("id", validation.data.id);

    if (DelError) {
      return Response.json(
        { message: "Failed to delete agent", error: true ,
        status: 500 }
      );
    }

    return Response.json(
      { message: "Agent deleted successfully", error: false ,
      status: 204 }
    );
  } catch (error) {
    console.log(error.message);
    return Response.json(
      { message: "Internal server error", error: true ,
      status: 500 }
    );
  }
}
