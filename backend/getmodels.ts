


const res = await fetch("https://openrouter.ai/api/v1/models");
const json = (await res.json()) as { data: any[] };
const free = json.data.filter((m: any) => m.id.endsWith(":free") || m.pricing?.prompt === "0").map((m: any) => m.id);
await Bun.write("verified_free_models.json", JSON.stringify(free, null, 2));
