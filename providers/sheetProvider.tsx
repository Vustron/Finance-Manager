'use client';

import { EditAccountSheet } from '@/components/sheets/edit-Account-Sheet';
import { NewAccountSheet } from '@/components/sheets/new-Account-Sheet';
import { useMountedState } from 'react-use';

export const SheetProvider = () => {
	const isMounted = useMountedState();

	if (!isMounted) return null;
	return (
		<>
			<EditAccountSheet />
			<NewAccountSheet />
		</>
	);
};
