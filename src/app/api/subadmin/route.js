// admission-management/src/app/api/subadmin/route.js
export async function GET() {
    return NextResponse.json({ message: 'Subadmin-specific data' });
}