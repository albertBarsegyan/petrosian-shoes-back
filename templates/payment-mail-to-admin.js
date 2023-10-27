const { getProductViewTemplate } = require('./payment-product-template')

const getPaymentMailToAdminTemplate = ({ purchase, isFailed, currency }) => {
  
  const purchaseItemsViewList = purchase.items.map(
    (shortIdP, index) =>
      getProductViewTemplate({
        shortIdImg: shortIdP,
        count: purchase.quantities[index],
        size: purchase.sizes[index],
        price: purchase.prices[index],
        productName: purchase?.productName?.[index] ?? null,
        currency,
      }))
    .join('')

  return `
                    <div style="font-size: 22px; margin: 20px auto; text-align: center;">
                    <div style="
                        padding: 30px 0;
                        box-shadow: 0 1px 5px #999;
                        background-color: rgba(247,247,247,.9);
                        width: 100%;">
                        <img src="https://petrosianshoes.com/static/media/logo.8cca1b05.png" alt="logo" style="width: 200px; height: 40px;">
                    </div>
                    <div style="background-color: rgba(51, 51, 51, 0.671); 
                    color: white;">
                        ${isFailed ? '<p>Payment failure.</p>' : '<p>Congratulations!</p>'}
                        <p>${purchase.fname} ${purchase.lname}, with email ${purchase.email} made a purchase in <a style="color: white; text-decoration: none" href="https://petrosianshoes.com/"
                                target="_blank">PetrosianShoes.com</a>.</p>
                        
${purchaseItemsViewList}
                    </div>
                </div>`
}

module.exports.getPaymentMailToAdminTemplate = getPaymentMailToAdminTemplate
