'use client';

import { useBulkDeleteTransactions } from '@/hooks/transactions/api/use-Bulk-Delete-Transactions';
import { useGetTransactions } from '@/hooks/transactions/api/use-Get-Transactions';
import { useNewTransaction } from '@/hooks/transactions/misc/use-New-Transaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/tables/data-Table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';

export default function TransactionsPage() {
	// add new accounts custom hook
	const newTransaction = useNewTransaction();
	// get accounts custom hook
	const transactionsQuery = useGetTransactions();
	// delete accounts custom hook
	const deleteTransactions = useBulkDeleteTransactions();
	// init delete state
	const isDisabled =
		transactionsQuery.isLoading || deleteTransactions.isPending;

	const transactions = transactionsQuery.data || [];

	if (transactionsQuery.isLoading) {
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
					<CardTitle className='text-xl line-clamp-1'>
						Transaction History
					</CardTitle>
					<Button size='sm' onClick={newTransaction.onOpen}>
						<Plus className='size-4 mr-2' />
						Add new
					</Button>
				</CardHeader>

				<CardContent>
					<DataTable
						columns={columns}
						data={transactions}
						filterKey='payee'
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id);
							deleteTransactions.mutate({ ids });
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
