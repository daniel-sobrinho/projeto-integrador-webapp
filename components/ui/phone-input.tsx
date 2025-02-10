"use client"

import { Input } from "./input"
import type { InputProps } from "./input"

export function PhoneInput({ value, onChange, ...props }: InputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    const numbers = value.replace(/\D/g, "")
    
    let formatted = numbers
    if (numbers.length > 0) {
      formatted = `(${numbers.slice(0, 2)}`
      if (numbers.length > 2) {
        formatted += `) ${numbers.slice(2, 7)}`
        if (numbers.length > 7) {
          formatted += `-${numbers.slice(7, 11)}`
        }
      }
    }

    e.target.value = formatted
    onChange?.(e)
  }

  return (
    <Input
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      placeholder="(00) 00000-0000"
      maxLength={15}
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
} 