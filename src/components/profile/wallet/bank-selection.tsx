"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useVietQR } from "@/hooks/use-vietqr";
import { IBank } from "@/services/types/bank.type";
import { on } from "events";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BankSelectionProps {
  selectedBank: string | null;
  onSelect: (bank: string) => void;
}

export const BankSelection = ({
  selectedBank,
  onSelect,
}: BankSelectionProps) => {
  const { getBank, banks } = useVietQR();
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState<IBank | null>(null);

  useEffect(() => {
    if (selectedBank) {
      const bank = getBank(selectedBank);
      if (bank) {
        setBank(bank);
        setOpen(false);
      }
    }
  }, [selectedBank, setBank, getBank]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedBank && bank ? (
            <div className="flex items-center gap-2">
              <Image
                src={bank.logo}
                alt={bank.name}
                width={24}
                height={24}
                className="w-14 h-14 object-contain"
              />
              <div className="flex-1">
                <p className="text-lg text-gray-600">{bank.code}</p>
                <p className="text-sm text-gray-600">{bank.name}</p>
              </div>
            </div>
          ) : (
            "Chọn ngân hàng..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {banks &&
                banks.map((bank) => (
                  <CommandItem
                    key={bank.id}
                    value={bank.bin}
                    onSelect={(currentValue) => {
                      onSelect(
                        currentValue === selectedBank ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={bank.logo}
                        alt={bank.name}
                        width={24}
                        height={24}
                        className="w-14 h-14 object-contain"
                      />
                      <div className="flex-1">
                        <p className="text-lg text-gray-600">{bank.code}</p>
                        <p className="text-sm text-gray-600">{bank.name}</p>
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
