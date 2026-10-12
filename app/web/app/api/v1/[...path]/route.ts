import { NextRequest, NextResponse } from "next/server";

const REMOTE_API_BASE = process.env.REMOTE_API_URL || "https://api.repsi.app/api/v1";

async function proxyRequest(
  req: NextRequest,
  props: { params: Promise<{ path: string[] }> }
) {
  const { path } = await props.params;
  const pathStr = Array.isArray(path) ? path.join("/") : (path || "");
  const search = req.nextUrl.search;
  const targetUrl = `${REMOTE_API_BASE}/${pathStr}${search}`;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(REMOTE_API_BASE).host);
  headers.set("origin", "https://repsi.app");
  headers.set("referer", "https://repsi.app/");

  // Remove client host/length headers that should be renegotiated by fetch
  headers.delete("content-length");

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await req.arrayBuffer()
      : undefined;

  try {
    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "*");

    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("API Proxy error to", targetUrl, err);
    return NextResponse.json(
      { detail: `API Proxy failed: ${err.message}` },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
