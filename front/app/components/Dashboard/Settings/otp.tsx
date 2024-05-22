import React, { useRef, useState, useEffect } from 'react';

export default function EnterCode({ register, isError , reset}: any) {
    const [code, setCode] = useState<any>('');

    // Refs to control each digit input element
    const inputRefs = [
        useRef<any>(null),
        useRef<any>(null),
        useRef<any>(null),
        useRef<any>(null),
        useRef<any>(null),
        useRef<any>(null),
    ];

    // Reset all inputs and clear state
    useEffect(() => {
        if (!reset || reset === false) return;
        
        inputRefs.forEach(ref => {
            ref.current.value = '';
        });
        inputRefs[0].current.focus();
        setCode('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [reset]);

    useEffect(() => {
        if (code?.length === 6)
            register('code', { value: code });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);
    

    // Handle input
    function handleInput(e : any, index : any) {
        const input = e.target;
        const previousInput = inputRefs[index - 1];
        const nextInput = inputRefs[index + 1];

        // Update code state with single digit
        const newCode = [...code];
        // Convert lowercase letters to uppercase
        if (/^[a-z]+$/.test(input.value)) {
            const uc = input.value.toUpperCase();
            newCode[index] = uc;
            inputRefs[index].current.value = uc;
        } else {
            newCode[index] = input.value;
        }
        setCode(newCode.join(''));

        input.select();

        if (input.value === '') {
            // If the value is deleted, select previous input, if exists
            if (previousInput) {
                previousInput.current.focus();
            }
        } else if (nextInput) {
            // Select next input on entry, if exists
            nextInput.current.select();
        }
    }

    // Select the contents on focus
    function handleFocus(e:any) {
        e.target.select();
    }

    // Capture pasted characters
    const handlePaste = (e : any) => {
        const pastedCode = e.clipboardData.getData('text');
        if (pastedCode.length === 6) {
            setCode(pastedCode);
            inputRefs.forEach((inputRef, index) => {
                inputRef.current.value = pastedCode.charAt(index);
            });
        }
    };

    const handleBackspace = (e: any) => {
        if (e.key === 'Backspace') {
            inputRefs.forEach(ref => {
                ref.current.value = '';
            });
            inputRefs[0].current.focus();
            setCode('');
        }
    };

    const errorClass = "border-red-500 border-2 glitch";

    return (
        <div className="flex gap-2 relative" onKeyDown={handleBackspace}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    className={`text-2xl bg-[#25364f] w-10 flex p-2 text-center text-white rounded-lg shadow-input px-3 py-2  placeholder-text-neutral-600 
                        focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none transition duration-400 ${isError ? errorClass : 'border-none'}`}
                    key={index}
                    type="text"
                    maxLength={1}
                    onChange={(e) => handleInput(e, index)}
                    ref={inputRefs[index]}
                    autoFocus={index === 0}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                />
            ))}
        </div>
    );
}