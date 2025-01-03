import { IconType } from "react-icons";
import { MdClose } from "react-icons/md";

interface AdminNavItemProps {
  selected?: boolean;
  icon: IconType;
  label: string;
  onClose?: () => void; // Optional
}

const AdminNavItem: React.FC<AdminNavItemProps> = ({
  selected,
  icon: Icon,
  label,
  onClose,
}) => {
  return (
    <div
      className={`flex items-start text-start gap-1 p-2 border-b-2 hover:text-slate-800 transition cursor-pointer${
        selected
          ? "border-b-slate-800 text-slate-800"
          : "border-transparent text-slate-500"
      }`}
    >
      <Icon size={20} />
      <div className="font-medium text-sm text-center break-normal flex items-center text-nowrap">
        {label}
        {onClose && (
          <MdClose
            size={16}
            className="ml-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminNavItem;
