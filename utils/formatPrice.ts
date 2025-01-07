
export const formatPrice = (amount: number | null | undefined) => {
  if (amount == null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  };
  