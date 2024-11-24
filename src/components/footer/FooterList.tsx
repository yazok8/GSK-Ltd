interface FooterListProps {
  children: React.ReactNode;
}

const FooterList: React.FC<FooterListProps> = ({ children }) => {
  return (
    <div
      className="
        text-white
        justify-center
        text-[16px]
        font-bold
        w-full
        mb-6
        flex
        gap-2
        flex-wrap
      "
    >
      {children}
    </div>
  );
};

export default FooterList;
  