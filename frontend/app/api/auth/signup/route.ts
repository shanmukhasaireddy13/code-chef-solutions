export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { API_ROUTES } from "@/lib/api";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        let jwtToken: string | null = null;

        try {
            const setCookieHeaders = response.headers.getSetCookie();
            for (const cookie of setCookieHeaders) {
                const jwtMatch = cookie.match(/jwt=([^;]+)/);
                if (jwtMatch) {
                    jwtToken = jwtMatch[1];
                    break;
                }
            }
        } catch (e) {
            const setCookieHeader = response.headers.get("set-cookie");
            if (setCookieHeader) {
                const jwtMatch = setCookieHeader.match(/jwt=([^;]+)/);
                if (jwtMatch) {
                    jwtToken = jwtMatch[1];
                }
            }
        }

        if (!jwtToken && data.token) {
            jwtToken = data.token;
        }

        const nextResponse = NextResponse.json(data);

        if (jwtToken) {
            const isSecure =
                process.env.NODE_ENV === "production" ||
                req.url.startsWith("https://");

            nextResponse.cookies.set("jwt", jwtToken, {
                httpOnly: true,
                secure: isSecure,
                sameSite: "lax",
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
        }

        return nextResponse;
    } catch (error) {
        console.error("Signup API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
