const { formatTimestamp } = require('../utils/string-utils')
const { getProductViewTemplate } = require('./payment-product-template')

const getPaymentSuccessMailToUserTemplate = ({ purchase, currency }) => {

  const purchaseItemsViewList = purchase.items.map(
    (shortIdP, index) =>
      getProductViewTemplate({
        shortIdImg: shortIdP,
        count: purchase.quantities[index],
        size: purchase.sizes[index],
        price: purchase.prices[index],
        productName: purchase?.productNames?.[index] ?? null,
        currency,
      }))
    .join('')

  const priceSummary = purchase.prices.reduce(((item, acc) => item + acc), 0)

  return (
    `<div style="background-color: #fafafa; padding-left: 10px; padding-right: 10px">
    <div>

        <div style="font-size: 22px; padding-top: 32px; margin-left: auto; margin-right: auto; text-align: center">
            <img alt="logo" src="https://petrosianshoes.com/static/media/logo.8cca1b05.png"
                 style="width: 200px; height: 40px;">
        </div>

        <div>
            <h1 style="text-align: center; font-family: Tahoma, sans-serif;font-size: 28px;color: #42454B">Dear <span>${purchase.fname} ${purchase.lname}</span>
            </h1>
            
            <div>
                <p style="text-align: center;
             font-family: Tahoma, sans-serif;
             font-size: 16px;
             max-width: 600px;
             box-sizing: border-box;
             margin: auto;
             color: #42454B;
             font-feature-settings: 'clig' off, 'liga' off;
             font-style: normal;
             font-weight: 500;
             line-height: 24px;
             letter-spacing: 1px;">
                    We are
                    delighted
                    to see that you
                    chose to shop with us, and we sincerely appreciate your support.</p>
            </div>
        </div>

        <div style="margin: 24px auto auto; border-radius: 8px;box-sizing: border-box;background-color: #42454B;color:white;width: 100%;max-width: 600px;padding:16px 32px">
            <p style="text-align: left;margin: 0;font-family: Tahoma, sans-serif">Order information</p>
        </div>


        <table style="max-width: 600px;width:100%;margin-top: 80px;margin-left: auto;margin-right: auto">
            <tr>
                <td>
                <span style="font-weight: 700;
  font-family: Tahoma, sans-serif;">Order number:</span>
                    <p style="margin: 0">${purchase.PaymentID}</p>
                </td>

                <td style="text-align: right">
                    <div>
                    <span style="font-weight: 700;
  font-family: Tahoma, sans-serif;">Total amount:</span>
                        <p style="margin: 0">${priceSummary} ${purchase.currency}</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding-top: 32px">
                <span style="font-weight: 700;
  font-family: Tahoma, sans-serif;">Shipping address:</span>
                    <p style="margin: 0">${purchase.country} ${purchase.region}</p>
                    <p style="margin: 0">${purchase.city} ${purchase.address} ${purchase.postalCode}</p>
                </td>

${purchase?.date && `<td style="text-align: right; vertical-align: top; padding-top: 32px">
                    <div>
                    <span style="font-weight: 700;
  font-family: Tahoma, sans-serif;">Payment Date:</span>

                        <p style="margin: 0">${formatTimestamp(purchase?.date)}</p>
                    </div>
                </td>`}
            </tr>
        </table>

        <div style="margin: 80px auto auto;border-radius: 8px;background-color: #42454B;color:white;width: 100%;max-width: 600px;padding:16px 32px;box-sizing: border-box;">
            <p style="text-align: left;margin: 0;font-family: Tahoma, sans-serif">Order Summary</p>
        </div>

        <div style="margin-top: 32px; max-width: 600px;margin-left: auto;margin-right: auto;width: 100%; text-align: center">
        ${purchaseItemsViewList}
        </div>

        <p style="text-align: center; font-family: Tahoma, sans-serif; max-width: 600px;margin: 32px auto;background-color: white; padding: 16px; border-radius: 8px;border: 1px solid #EFF3F6;box-sizing: border-box;font-size: 16px;line-height: 24px">
            We'll make
            sure
            to send you your shipment
            tracking number just as soon as we have it ready for you! 😊📦</p>
    </div>

    <footer>
        <div style="width: 600px;margin: 0 auto;padding: 24px 16px 16px;background-color: white; border-radius: 8px 8px 0 0; box-sizing: border-box; text-align: center;border: 1px solid #EFF3F6;border-bottom: 0">
            <a href="https://petrosianshoes.com/" target="_blank">
                <img alt="logo" src="https://petrosianshoes.com/static/media/logo.8cca1b05.png"
                     style="width: 200px; height: 40px;">
            </a>
        </div>
    </footer>
</div>`
  )
}

exports.getPaymentSuccessMailToUserTemplate = getPaymentSuccessMailToUserTemplate
