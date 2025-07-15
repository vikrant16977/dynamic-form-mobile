export default async function handler(req, res) {
  const url = "https://dynamicformbackend.onrender.com/odata/v4/catalog/Forms";

  try {
    // Forward method, headers, and body
    const apiRes = await fetch(url, {
      method: req.method,
      headers: { ...req.headers, host: undefined }, // Remove 'host' header for CORS
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const contentType = apiRes.headers.get("content-type");
    res.setHeader("Content-Type", contentType);

    const data = await apiRes.arrayBuffer();
    res.status(apiRes.status).send(Buffer.from(data));
  } catch (e) {
    res.status(500).json({ error: "Proxy error", details: e.message });
  }
}