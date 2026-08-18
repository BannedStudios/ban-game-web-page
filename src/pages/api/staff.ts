import type { APIRoute } from "astro";
import { getAllStaff, addStaff, deleteStaff, updateStaff } from "../../libs/firestore/staff";

export const GET: APIRoute = async () => {
  const codes = await getAllStaff();
  return new Response(JSON.stringify(codes), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, link, skills, avatar, order } = data;

    if (!name || !link || !skills || !avatar || order === undefined) {
      return new Response(JSON.stringify({ error: "Faltan campos" }), { status: 400 });
    }

    const newStaff = await addStaff({ name, link, skills, avatar, order });
    return new Response(JSON.stringify(newStaff), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al agregar el staff" }), {
      status: 500,
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: "Falta el ID" }), { status: 400 });
    }

    await deleteStaff(id);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al eliminar el staff" }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, name, link, skills, avatar, order } = data;

    if (!id) {
      return new Response(JSON.stringify({ error: "Falta el ID" }), { status: 400 });
    }

    const updateData = { name, link, skills, avatar, order };
    
    await updateStaff(id, updateData);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Error al actualizar el staff" }), {
      status: 500,
    });
  }
};