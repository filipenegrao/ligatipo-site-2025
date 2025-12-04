import { auth } from "@/auth";
import type { ProxyHandler } from "next/server";

// Next.js 16 proxy: runs before routing, similar to middleware
export const proxy: ProxyHandler = async (request) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/admin")) {
        const session = await auth();
        if (!session) {
            url.pathname = "/login";
            return Response.redirect(url);
        }
        // Optional: role check here in future
    }

    // Continue request as-is
    return undefined; // returning undefined lets Next continue processing
};

export const config = {
    matcher: ["/admin/:path*"],
};
