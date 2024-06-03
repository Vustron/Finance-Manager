"use client";

import { useBulkDeleteCategories } from "@/hooks/categories/api/use-Bulk-Delete-Categories";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetCategories } from "@/hooks/categories/api/use-Get-Categories";
import { useNewCategory } from "@/hooks/categories/misc/use-New-Category";
import { DataTable } from "@/components/tables/data-Table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { columns } from "./columns";

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
          <CardTitle className="line-clamp-1 text-xl">
            Categories page
          </CardTitle>
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            filterKey="name"
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
