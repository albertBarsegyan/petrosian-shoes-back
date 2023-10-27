const getProductViewTemplate = ({ shortIdImg, count, size, price, productName, currency }) => {
  const countResult = count > 1 ? `, ${count} pairs` : ''

  return (`<div style="width: 100%; max-width: 250px;background-color: white; padding: 16px;border-radius: 16px; box-sizing: border-box; border: 1px solid #EFF3F6; display: inline-block; margin: 8px">
                <div>
                    <img alt="item"
                         src="https://petrosianshoes.com/upload/${shortIdImg}/thumb.avatar.jpg"
                         style="border-radius: 8px; display: block;width: 100%"
                    />
                </div>

                <div style="margin-top: 16px; width: auto; padding-bottom: 16px;text-align: left">
                 ${productName ? `<p style="
                                margin-top: 8px;
                                margin-bottom: 0;
                                font-family: Tahoma, sans-serif"><span style="font-weight: 700">Name:</span>
                        ${productName}</p>` : ''}
                    <p style="
                                margin-top: 8px;
                                margin-bottom: 0;
                                font-family: Tahoma, sans-serif"><span style="font-weight: 700">Price:</span>
                        ${price} ${currency}</p>
                    <p style="
                                margin: 8px 0 0;
                                font-family: Tahoma, sans-serif"><span style="font-weight: 700">Size: </span>
                        ${size}${countResult}</p>
   
                </div>
            </div>
`)
}

module.exports.getProductViewTemplate = getProductViewTemplate
