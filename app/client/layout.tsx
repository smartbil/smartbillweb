'use client';
import Header from '../components/client/header';

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="min-h-screen">
            <Header />
            <div className="h-screen bg-white">{children}</div>

        </div>
    );
}
