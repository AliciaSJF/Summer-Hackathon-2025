export async function crearEvento(businessId: string, evento: any) {
  console.log("Creando evento:", evento);
  const res = await fetch(
    `http://localhost:8001/businesses/${businessId}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(evento),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear el evento: ${errorText}`);
  }

  return res.json();
}

export async function obtenerEventos(businessId: string) {
  const res = await fetch(
    `http://localhost:8001/businesses/${businessId}/events`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Error al obtener eventos");

  return res.json();
}
