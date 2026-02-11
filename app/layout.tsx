import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // Changed from Inter
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] }); // Changed from Inter

export const metadata: Metadata = {
    title: "Login || New HD Resseler Dashbord", // Updated title from source
    description: "New HD Reseller control panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={montserrat.className}>{children}</body>
        </html>
    );
}
