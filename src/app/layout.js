import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Integrated Study Centre for Huffaz in Malabar | Islamic Dawa Academy",
  description: "Best campus for huffaz for higher education with outstanding skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>  {/* ✅ Wrap the entire app with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
