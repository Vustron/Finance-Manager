'use client';

import { EditCategorySheet } from '@/components/sheets/edit-Category-Sheet';
import { NewCategorySheet } from '@/components/sheets/new-Category-Sheet';
import { EditAccountSheet } from '@/components/sheets/edit-Account-Sheet';
import { NewAccountSheet } from '@/components/sheets/new-Account-Sheet';
import { useMountedState } from 'react-use';

export const SheetProvider = () => {
	const isMounted = useMountedState();

	if (!isMounted) return null;
	return (
		<>
			<EditAccountSheet />
			<EditCategorySheet />
			<NewAccountSheet />
			<NewCategorySheet />
		</>
	);
};
