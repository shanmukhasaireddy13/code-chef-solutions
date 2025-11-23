export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { API_ROUTES } from "@/lib/api";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("ENV API_URL =", process.env.API_URL);

        const res = await fetch(API_ROUTES.AUTH.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const text = await res.text();
        console.log("Login API Response Status:", res.status);
        console.log("Login API Response Body:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON:", e);
            return NextResponse.json(
                { message: "Invalid response from server" },
                { status: 502 }
            );
        }

        const response = NextResponse.json(data, { status: res.status });

        if (data.token) {
            response.cookies.set("jwt", data.token, {
                httpOnly: true,
                path: "/",
            });
        }

        return response;
    } catch (error) {
        console.error("Login API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
