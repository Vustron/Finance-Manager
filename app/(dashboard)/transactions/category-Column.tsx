import { useOpenTransaction } from "@/hooks/transactions/misc/use-Open-Transaction";
import { useOpenCategory } from "@/hooks/categories/misc/use-Open-Category";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  const onClick = () => {
    // @ts-ignore
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer items-center hover:underline",
        !category && "text-rose-500",
      )}
    >
      {!category && (
        <div className="flex flex-row">
          <TriangleAlert className="mr-2 size-4" />
          <span>Uncategorized</span>
        </div>
      )}
      {category}
    </div>
  );
};

export default CategoryColumn;
