"use client";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCreateTransaction } from "@/hooks/transactions/api/use-Create-Transaction";
import { useNewTransaction } from "@/hooks/transactions/misc/use-New-Transaction";
import { useCreateCategory } from "@/hooks/categories/api/use-Create-Category";
import { useGetCategories } from "@/hooks/categories/api/use-Get-Categories";
import { useCreateAccount } from "@/hooks/accounts/api/use-Create-Account";
import { useGetAccounts } from "@/hooks/accounts/api/use-Get-Accounts";
import { TransactionForm } from "@/components/forms/transaction-form";
import { insertTransactionsSchema } from "@/db/schema";
import { useMountedState } from "react-use";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = insertTransactionsSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const isMounted = useMountedState();

  // import custom hook
  const { isOpen, onClose } = useNewTransaction();

  const createMutation = useCreateTransaction();

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

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  if (!isMounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Create a new transaction</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            disabled={isPending}
            onCreateCategory={onCreateCategory}
            categoryOptions={categoryOptions}
            onCreateAccount={onCreateAccount}
            accountOptions={accountOptions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
