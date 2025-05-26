import { cn } from "@/utils/merge";

/* eslint-disable @typescript-eslint/ban-ts-comment */
export type IconsProps = {
    color?: string;
    className?: string;
}


export const FootballPlayer: React.FC<IconsProps> = ({className}) => {
    return (
        <img src="/FootballPlayer.svg" alt="FootballPlayer" className={cn("", className)} />
    );
}

export const Goalkeeper: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/GoolKeper.svg" alt="GoolKeper" className={cn("", className)} />
    );
}

export const Coach: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/Coach.svg" alt="Coach" className={cn("", className)} />
    );
}

export const Manager: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/Manager.svg" alt="Manager" className={cn("", className)} />
    );
}

export const GoalkeepingCoach: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/GoalkeepingCoach.svg" alt="GoalkeepingCoach" className={cn("", className)} />
    );
}

export const Observer: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/Observer.svg" alt="Observer" className={cn("", className)} />
    );
}

export const AthleticTrainer: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/AthleticTrainer.svg" alt="AthleticTrainer" className={cn("", className)} />
    );
}

export const HealthWorker: React.FC<IconsProps> = ({ className }) => {
    return (
        <img src="/HealthWorker.svg" alt="HealthWorker" className={cn("", className)} />
    );
}
