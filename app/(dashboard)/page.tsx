'use client';

import { useNewAccount } from '@/hooks/accounts/misc/use-New-Account';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
	// import custom hook
	const { onOpen } = useNewAccount();

	return (
		<div>
			<Button onClick={onOpen}>Add an account</Button>
		</div>
	);
}
