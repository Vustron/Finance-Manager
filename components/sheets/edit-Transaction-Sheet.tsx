"use client";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { useDeleteTransaction } from "@/hooks/transactions/api/use-Delete-Transaction";
import { useOpenTransaction } from "@/hooks/transactions/misc/use-Open-Transaction";
import { useEditTransaction } from "@/hooks/transactions/api/use-Edit-Transaction";
import { useGetTransaction } from "@/hooks/transactions/api/use-Get-Transaction";
import { useCreateCategory } from "@/hooks/categories/api/use-Create-Category";
import { useGetCategories } from "@/hooks/categories/api/use-Get-Categories";
import { useCreateAccount } from "@/hooks/accounts/api/use-Create-Account";
import { useGetAccounts } from "@/hooks/accounts/api/use-Get-Accounts";
import { TransactionForm } from "@/components/forms/transaction-form";
import { useConfirm } from "@/hooks/accounts/misc/use-Confirm";
import { insertTransactionsSchema } from "@/db/schema";
import { useMountedState } from "react-use";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = insertTransactionsSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const isMounted = useMountedState();

  // import custom hook
  const { isOpen, onClose, id } = useOpenTransaction();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction",
  );

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();

  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });

  const categoryOptions = (categoryQuery.data ?? []).map(
    (category: { name: string; id: string }) => ({
      label: category.name,
      values: category.id,
    }),
  );

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();

  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });

  const accountOptions = (accountQuery.data ?? []).map(
    (account: { name: string; id: string }) => ({
      label: account.name,
      values: account.id,
    }),
  );

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  if (!isMounted) return null;

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              onDelete={onDelete}
              onCreateCategory={onCreateCategory}
              categoryOptions={categoryOptions}
              onCreateAccount={onCreateAccount}
              accountOptions={accountOptions}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
