import { useOpenAccount } from "@/hooks/accounts/misc/use-Open-Account";

type Props = {
  account: string;
  accountId: string;
};

const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer items-center hover:underline"
    >
      {account}
    </div>
  );
};

export default AccountColumn;
