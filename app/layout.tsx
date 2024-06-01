import CustomToaster from '@/providers/customToastProvider';
import { SheetProvider } from '@/providers/sheetProvider';
import QueryProvider from '@/providers/queryProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Finance Manager',
	description: 'A finance manager made using Next.js and Hono',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<QueryProvider>
						<SheetProvider />
						<CustomToaster />
						{children}
					</QueryProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
