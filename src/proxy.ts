import { clerkMiddleware } from '@clerk/nextjs/server';

// nextjs 내부에서 사용하는 모듈 
// nextjs에서 모든 요청이 들어올 때 중간에서 가로채서 로그인 여부를 체크하는 역할
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};