import { Snippet } from "@nextui-org/react";
import { getBaseUrl } from "lib/requests/api.request";
import { usePathname, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

const LinksShare = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams().get("page");
  const pathUrl = getBaseUrl();
  const URL_TO_SHARE = `${pathUrl}${pathname}?page=${searchParams}`;

  return (
    <>
      <p className="text-xs mb-2 mt-2">Your personal referral Qr code :</p>
      <div className="border-small px-2 py-2 rounded-small border-default-200 dark:border-default-100 z-20 flex w-fit m-auto">
        <QRCodeSVG value={URL_TO_SHARE} />
      </div>
      <p className="text-xs mb-2 mt-2">Your personal referral link :</p>
      <Snippet size="sm" hideSymbol variant="bordered">
        <p className="line-clamp-1 text-ellipsis overflow-hidden text-xs">
          {URL_TO_SHARE}
        </p>
      </Snippet>
    </>
  );
};

export default LinksShare;
