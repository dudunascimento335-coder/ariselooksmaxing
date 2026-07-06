export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/system/:path*', '/admin/:path*'],
}
