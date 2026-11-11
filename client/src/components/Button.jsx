const styles = {
  yellow: "bg-brand-yellow text-blue-900",
  green: "bg-brand-green text-white",
  red: "bg-brand-red text-white",
  blue: "bg-blue-500 text-white",
  gray: "bg-gray-300 text-gray-500 cursor-not-allowed",
};

export default function Button({ color = "yellow", children, ...props }) {
  return (
    <button
      className={`w-full rounded-2xl py-3 font-bold shadow-md ${styles[color]}`}
      {...props}
    >
      {children}
    </button>
  );
}