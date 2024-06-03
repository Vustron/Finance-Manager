"use client";

import { useBulkDeleteAccounts } from "@/hooks/accounts/api/use-Bulk-Delete-Accounts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetAccounts } from "@/hooks/accounts/api/use-Get-Accounts";
import { useNewAccount } from "@/hooks/accounts/misc/use-New-Account";
import { DataTable } from "@/components/tables/data-Table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { columns } from "./columns";

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
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>

          <CardContent>
            <div className="flex h-[500px] w-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">Accounts page</CardTitle>
          <Button size="sm" onClick={newAccount.onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            filterKey="name"
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
