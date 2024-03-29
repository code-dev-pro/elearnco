import { useState } from "react";
import { Input } from "@nextui-org/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { IconUI } from "ui/icon/IconUI";
import { useDebouncedCallback } from "use-debounce";
import { ICON_SIZE } from "ui";
const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const query =searchParams.get("query")?.toString() || ""
  const [value, setValue] = useState<string>(query);

  const _setValue = (value: string) => {
    setValue(value);
    _handleSearch(value);
  };

  const _handleSearch = useDebouncedCallback((term: string):void => {
    setValue(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 0); // use a value != 0 if fetching in database

  return (
    <div className="w-[240px] flex justify-center items-center bg-default-50 rounded-xl">
      <Input
        label="Search"
        isClearable
        radius="lg"
        value={value}
        variant="bordered"
        defaultValue={searchParams.get("query")?.toString()}
        onValueChange={_setValue}
        placeholder="Type to search a title lesson..."
        startContent={
          <IconUI
            width={ICON_SIZE.width}
            height={ICON_SIZE.height}
            name="search"
          />
        }
      />
    </div>
  );
};

export default Search;
