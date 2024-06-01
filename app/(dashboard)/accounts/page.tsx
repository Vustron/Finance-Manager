'use client';

import { useBulkDeleteAccounts } from '@/hooks/accounts/api/use-Bulk-Delete-Accounts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGetAccounts } from '@/hooks/accounts/api/use-Get-Accounts';
import { useNewAccount } from '@/hooks/accounts/misc/use-New-Account';
import { DataTable } from '@/components/tables/data-Table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';

export default function AccountsPage() {
	// add new accounts custom hook
	const newAccount = useNewAccount();
	// get accounts custom hook
	const accountsQuery = useGetAccounts();
	// delete accounts custom hook
	const deleteAccounts = useBulkDeleteAccounts();
	// init delete state
	const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

	const accounts = accountsQuery.data || [];

	if (accountsQuery.isLoading) {
		return (
			<div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
				<Card className='border-none drop-shadow-sm'>
					<CardHeader>
						<Skeleton className='h-8 w-48' />
					</CardHeader>

					<CardContent>
						<div className='h-[500px] w-full flex items-center justify-center'>
							<Loader2 className='size-6 text-slate-300 animate-spin' />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Accounts page</CardTitle>
					<Button size='sm' onClick={newAccount.onOpen}>
						<Plus className='size-4 mr-2' />
						Add new
					</Button>
				</CardHeader>

				<CardContent>
					<DataTable
						columns={columns}
						data={accounts}
						filterKey='name'
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id);
							deleteAccounts.mutate({ ids });
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
