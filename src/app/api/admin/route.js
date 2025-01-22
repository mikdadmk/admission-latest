// admission-management/src/app/api/admin/route.js
export async function GET() {
    return NextResponse.json({ message: 'Admin-specific data' });
}