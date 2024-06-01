import {
	Form,
	FormItem,
	FormField,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';

import TransactionSelect from '@/components/shared/transactionSelect';
import AmountInput from '@/components/shared/amountInput';
import DatePicker from '@/components/shared/datePicker';
import { insertTransactionsSchema } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { z } from 'zod';
import { convertAmountToMiliunits } from '@/lib/utils';

const formSchema = z.object({
	date: z.coerce.date(),
	accountId: z.string(),
	categoryId: z.string().nullable().optional(),
	payee: z.string(),
	amount: z.string(),
	notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionsSchema.omit({
	id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: (values: ApiFormValues) => void;
	onDelete?: () => void;
	disabled?: boolean;
	accountOptions: { label: string; values: string }[];
	categoryOptions: { label: string; values: string }[];
	onCreateAccount: (name: string) => void;
	onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
	accountOptions,
	categoryOptions,
	onCreateAccount,
	onCreateCategory,
}: Props) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	});

	const handleSubmit = (values: FormValues) => {
		const amount = parseFloat(values.amount);
		const amountInMiliUnits = convertAmountToMiliunits(amount);

		console.log(values);
		onSubmit({
			...values,
			amount: amountInMiliUnits,
		});
	};

	const handleDelete = () => {
		onDelete?.();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className='space-y-4 pt-4'
			>
				<FormField
					name='date'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='accountId'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account</FormLabel>

							<FormControl>
								<TransactionSelect
									placeholder='Select an account'
									options={accountOptions}
									onCreate={onCreateAccount}
									value={field.value}
									onChange={field.onChange}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='categoryId'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>

							<FormControl>
								<TransactionSelect
									placeholder='Select a category'
									options={categoryOptions}
									onCreate={onCreateCategory}
									value={field.value}
									onChange={field.onChange}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='payee'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Payee</FormLabel>

							<FormControl>
								<Input
									disabled={disabled}
									placeholder='Add a payee'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='amount'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>

							<FormControl>
								<AmountInput
									{...field}
									disabled={disabled}
									placeholder='0.00'
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='notes'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>

							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ''}
									disabled={disabled}
									placeholder='Optional notes'
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button className='w-full' disabled={disabled}>
					{id ? 'Save changes' : 'Create transaction'}
				</Button>

				{!!id && (
					<Button
						type='button'
						onClick={handleDelete}
						className='w-full'
						size='icon'
						variant='outline'
						disabled={disabled}
					>
						<Trash className='size-4 mr-2' />
						Delete transaction
					</Button>
				)}
			</form>
		</Form>
	);
};
