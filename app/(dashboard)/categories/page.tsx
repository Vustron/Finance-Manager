'use client';

import { useBulkDeleteCategories } from '@/hooks/categories/api/use-Bulk-Delete-Categories';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useGetCategories } from '@/hooks/categories/api/use-Get-Categories';
import { useNewCategory } from '@/hooks/categories/misc/use-New-Category';
import { DataTable } from '@/components/tables/data-Table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { columns } from './columns';

export default function CategoriesPage() {
	// add new accounts custom hook
	const newCategory = useNewCategory();
	// get accounts custom hook
	const categoriesQuery = useGetCategories();
	// delete accounts custom hook
	const deleteCategories = useBulkDeleteCategories();
	// init delete state
	const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

	const categories = categoriesQuery.data || [];

	if (categoriesQuery.isLoading) {
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
						Categories page
					</CardTitle>
					<Button size='sm' onClick={newCategory.onOpen}>
						<Plus className='size-4 mr-2' />
						Add new
					</Button>
				</CardHeader>

				<CardContent>
					<DataTable
						columns={columns}
						data={categories}
						filterKey='name'
						onDelete={(row) => {
							const ids = row.map((r) => r.original.id);
							deleteCategories.mutate({ ids });
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
