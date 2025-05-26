type ToggleSwitchProps = {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => {

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        enabled ? "bg-[#0A2A42]" : "bg-[#1a1a1a]"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-6 bg-[#1EA7FD]" : "translate-x-0 bg-[#555555]"
        }`}
      ></div>
    </div>
  );
}