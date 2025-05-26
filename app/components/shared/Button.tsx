import { cn } from '@/utils/merge';
import React from 'react'


type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type }) => {
  return (
    <button className={cn('w-max px-6 bg-gradient-to-r from-[#2195F2] to-[#0d7ad9] text-white py-3 rounded-[100px] font-semibold shadow-lg hover:from-[#0d7ad9] hover:to-[#2195F2] min-w-[148px] transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center min-w-[148px]', className)} onClick={onClick} type={type ? type : "button"}>
        {children}
    </button>
  )
}

export default Button