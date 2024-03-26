function calculateTax(item, taxRates, exemptCategories) {
    var basicTax = 0;
    var importDuty = 0;
    // Calculate Basic Tax for non-exempt categories
    if (!isExempt(item.name, exemptCategories)) {
        basicTax = item.price * taxRates.basicTaxRate;
    }
    // Calculate Import Duty
    if (item.name.includes("imported")) {
        importDuty = item.price * taxRates.importDutyRate;
    }
    var totalTax = roundUpToNearest5Paise(basicTax + importDuty);
    var totalPrice = item.price + totalTax;
    return {
        item: "".concat(item.quantity, " ").concat(item.name, ": ").concat(totalPrice.toFixed(2)),
        totalPrice: totalPrice
    };
}
function isExempt(name, exemptCategories) {
    return exemptCategories.some(function (category) { return name.includes(category); });
}
function roundUpToNearest5Paise(amount) {
    return Math.ceil(amount * 20) / 20;
}
function generateReceipt(cart, taxRates, exemptCategories) {
    var items = [];
    var totalTax = 0;
    for (var _i = 0, cart_1 = cart; _i < cart_1.length; _i++) {
        var item = cart_1[_i];
        var itemDetails = item.split(" ");
        var quantity = parseInt(itemDetails[0]);
        var price = parseFloat(itemDetails[itemDetails.length - 1]);
        var name_1 = itemDetails.slice(1, -2).join(" ").toLowerCase();
        var receiptItem = calculateTax({ quantity: quantity, name: name_1, price: price }, taxRates, exemptCategories);
        items.push(receiptItem);
        totalTax += receiptItem.totalPrice - price;
    }
    totalTax = roundUpToNearest5Paise(totalTax);
    var totalCost = items.reduce(function (total, item) { return total + item.totalPrice; }, 0);
    console.log(items.map(function (item) { return item.item; }).join("\n"));
    console.log("Tax: ".concat(totalTax.toFixed(2)));
    console.log("Total: ".concat(totalCost.toFixed(2)));
}
// Example inputs
var shoppingCarts = [
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
var taxRates = {
    basicTaxRate: 0.1,
    importDutyRate: 0.05
};
var exemptCategories = ["book", "chocolate", "headache pills"];
for (var _i = 0, shoppingCarts_1 = shoppingCarts; _i < shoppingCarts_1.length; _i++) {
    var shoppingCart = shoppingCarts_1[_i];
    generateReceipt(shoppingCart, taxRates, exemptCategories);
    console.log("-------------------------------------------");
}
