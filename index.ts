type Item = {
  quantity: number;
  name: string;
  price: number;
};

type TaxRates = {
  basicTaxRate: number;
  importDutyRate: number;
};

type ReceiptItem = {
  item: string;
  totalPrice: number;
};

function calculateTax(item: Item, taxRates: TaxRates, exemptCategories: string[]): ReceiptItem {
  let basicTax = 0;
  let importDuty = 0;

  // Calculate Basic Tax for non-exempt categories
  if (!isExempt(item.name, exemptCategories)) {
      basicTax = item.price * taxRates.basicTaxRate;
  }

  // Calculate Import Duty
  if (item.name.includes("imported")) {
      importDuty = item.price * taxRates.importDutyRate;
  }

  const totalTax = roundUpToNearest5Paise(basicTax + importDuty);
  const totalPrice = item.price + totalTax;

  return {
      item: `${item.quantity} ${item.name}: ${totalPrice.toFixed(2)}`,
      totalPrice: totalPrice
  };
}

function isExempt(name: string, exemptCategories: string[]): boolean {
  return exemptCategories.some(category => name.includes(category));
}

function roundUpToNearest5Paise(amount: number): number {
  return Math.ceil(amount * 20) / 20;
}

function generateReceipt(cart: string[], taxRates: TaxRates, exemptCategories: string[]): void {
  const items: ReceiptItem[] = [];
  let totalTax = 0;

  for (const item of cart) {
      const itemDetails = item.split(" ");
      const quantity = parseInt(itemDetails[0], 10);
      const price = parseFloat(itemDetails[itemDetails.length - 1]);
      const name = itemDetails.slice(1, -2).join(" ").toLowerCase();

      const receiptItem = calculateTax({ quantity, name, price }, taxRates, exemptCategories);
      items.push(receiptItem);
      totalTax += receiptItem.totalPrice - price;
  }

  totalTax = roundUpToNearest5Paise(totalTax);
  const totalCost = items.reduce((total, item) => total + item.totalPrice, 0);

  console.log(items.map(item => item.item).join("\n"));
  console.log(`Tax: ${totalTax.toFixed(2)}`);
  console.log(`Total: ${totalCost.toFixed(2)}`);
}

// Example inputs and outputs
const shoppingCarts: string[][] = [
  [
      "1 book at 124.99",
      "1 music CD at 149.99",
      "1 chocolate bar at 40.85"
  ],
  [
      "1 imported box of chocolates at 100.00",
      "1 imported bottle of perfume at 470.50"
  ],
  [
      "1 imported bottle of perfume at 270.99",
      "1 bottle of perfume at 180.99",
      "1 packet of headache pills at 19.75",
      "1 box of imported chocolates at 210.25"
  ]
];

const taxRates: TaxRates = {
  basicTaxRate: 0.1,
  importDutyRate: 0.05
};

const exemptCategories: string[] = ["book", "chocolate", "headache pills"];

for (const shoppingCart of shoppingCarts) {
  generateReceipt(shoppingCart, taxRates, exemptCategories);
  console.log("-------------------------------------------");
}
