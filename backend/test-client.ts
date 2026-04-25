const res = await fetch("http://localhost:3000/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Define the word Artificial Intelligence in one paragraph" })
});

if (!res.body) throw new Error("No response body");

// Usamos el lector nativo de Web Streams
const reader = res.body.getReader();
const decoder = new TextDecoder();

console.log("Generando respuesta:\n");

while (true) {
  // Leemos trocito a trocito lo que escupe el servidor
  const { done, value } = await reader.read();
  if (done) break;

  // Imprimimos sin saltos de línea molestos
  process.stdout.write(decoder.decode(value));
}

console.log("\n\n✅ ¡Terminado!");
