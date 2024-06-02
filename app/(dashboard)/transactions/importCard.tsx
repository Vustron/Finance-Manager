'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ImportTable from './importTable';
import { useState } from 'react';

const requiredOptions = ['amount', 'date', 'payee'];
const dateFormat = 'yyyy-MM-dd HH:mm:ss';
const outputFormat = 'yyyy-MM-dd';

interface SelectedColumnsState {
	[key: string]: string | null;
}

type Props = {
	data: string[][];
	onCancel: () => void;
	onSubmit: (data: any) => void;
};

const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
	// init state
	const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
		{}
	);

	const headers = data[0];
	const body = data.slice(1);

	const onTableHeadSelectChange = (
		columnIndex: number,
		value: string | null
	) => {
		setSelectedColumns((prev) => {
			const newSelectedColumns = { ...prev };

			for (const key in newSelectedColumns) {
				if (newSelectedColumns[key] === value) {
					newSelectedColumns[key] = null;
				}
			}

			if (value === 'skip') {
				value = null;
			}

			newSelectedColumns[`column_${columnIndex}`] = value;
			return newSelectedColumns;
		});
	};

	return (
		<div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-sm'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>
						Import Transaction
					</CardTitle>

					<div className='flex items-center gap-x-2'>
						<Button size='sm' onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					<ImportTable
						headers={headers}
						body={body}
						selectedColumns={selectedColumns}
						onTableHeadSelectChange={onTableHeadSelectChange}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default ImportCard;