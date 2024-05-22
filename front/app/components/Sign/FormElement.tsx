import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import React from "react";
import { rajdhani } from "@/app/utils/fontConfig";
import { cn } from "@/components/cn";

interface FormElementProps {
  form: any; // Replace 'any' with the specific type of 'form' if available
  placeholder: string; // Add the 'placeholder' property
}

const FormElement: React.FC<FormElementProps> = ({ form, placeholder }) => {
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);
  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };
  return (
    <FormField
      control={form.control}
      name={placeholder}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <motion.div className="w-full flex flex-col relative">
              <Input
                placeholder={placeholder.toUpperCase()}
                type={placeholder === "password" ? "password" : "text"}
                {...field}
                onFocus={() => handleInputFocus(placeholder)}
                onBlur={() => setFocusedInput(null)}
                autoComplete="off"
                className={cn(
                  "bg-transparent placeholder:text-buttonGray font-semibold text-lg xm:text-xl md:text-2xl border-b-2 tracking-wider",
                  rajdhani.className
                )}
              />
              <motion.span
                className="w-full border absolute bottom-[0px] z-1"
                initial={{
                  width: "0%",
                  left: "50%",
                  borderColor: "transparent",
                  opacity: 0,
                }}
                animate={{
                  width: focusedInput === placeholder ? "100%" : "0%",
                  left: focusedInput === placeholder ? "0%" : "50%",
                  borderColor:
                    focusedInput === placeholder ? "red" : "transparent",
                  opacity: focusedInput === placeholder ? 1 : 0,
                }}
              />
            </motion.div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormElement;
