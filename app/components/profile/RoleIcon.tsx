import React from "react";
import { FootballPlayer, Goalkeeper, Coach, Manager, GoalkeepingCoach, Observer, AthleticTrainer, HealthWorker } from "../icons/footballFiguresIcons";
import { cn } from "@/utils/merge";
const calcioData = [
  {
    category: { name: "Calciatore", icon: <FootballPlayer className="w-[60px] max-w-[60px]" /> },
    sottoruoli: [
      { name: "Difensore", icon: <div></div> },
      { name: "Centrocampista", icon: <div></div> },
      { name: "Attaccante", icon: <div></div> },
    ],
  },
  { category: { name: "Portiere", icon: <Goalkeeper className="w-[60px] max-w-[60px] text-[#2195F2] scale-125" /> } },
  { category: { name: "Allenatore", icon: <Coach className="w-[60px] max-w-[60px]" /> } },
  { category: { name: "Dirigente", icon: <Manager className="w-[60px] max-w-[60px]" /> } },
  { category: { name: "Allenatore portieri", icon: <GoalkeepingCoach className="w-[60px] max-w-[60px]" /> } },
  { category: { name: "Osservatore", icon: <Observer className="w-[60px] max-w-[60px]" /> } },
  { category: { name: "Preparatore atletico", icon: <AthleticTrainer className="w-[60px] max-w-[60px]" /> } },
  { category: { name: "Operatore sanitario", icon: <HealthWorker className="w-[60px] max-w-[60px]" /> } },
];

type RoleIconProps = {
  ruolo: string;
  className?: string;
  internalClassName?: string;
}

const RoleIcon: React.FC<RoleIconProps> = ({ ruolo, className, internalClassName }) => {
  const match = calcioData.find((item) => {
    if (item.category.name === ruolo) return true;
    if (item.sottoruoli?.some((sr) => sr.name === ruolo)) return true;
    return false;
  });

  if (!match) return     <div className={cn("bg-transparent border-[3px] border-primary w-[122px] h-[122px] lg:w-[200px] lg:h-[200px] rounded-full flex items-center justify-center relative", className)}>
  <div className={cn("scale-150", internalClassName)}>
  -
  </div>
 
</div>;

  return (
    <div className={cn("bg-transparent border-[3px] border-primary w-[122px] h-[122px] lg:w-[200px] lg:h-[200px] rounded-full flex items-center justify-center relative", className)}>
        <div className={cn("", internalClassName)}>
        {match.category.icon}
        </div>
       
    </div>
  )
};

export default RoleIcon;
