export async function getBusinessById(id: string) {
  const res = await fetch(`http://localhost:8001/businesses/${id}`);
  console.log(res);
  if (!res.ok) throw new Error("Error al obtener datos del negocio");
  return res.json();
}
