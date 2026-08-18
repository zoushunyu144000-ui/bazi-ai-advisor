import { NextResponse, type NextRequest } from "next/server";

import { refreshSupabaseSession } from "@/lib/supabase/proxy";

const STATIC_PROTOTYPE_PUBLIC_ROUTES = new Set(["/", "/birth", "/result"]);

export async function proxy(request: NextRequest) {
  if (STATIC_PROTOTYPE_PUBLIC_ROUTES.has(request.nextUrl.pathname)) {
    return NextResponse.next({ request });
  }

  return refreshSupabaseSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
