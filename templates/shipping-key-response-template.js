const shippingKeyResponseTemplate = ({ shippingKey, courierServiceName, courierServiceLink, fname, lname }) => {

  return (
    `
     <div
      style="
        background-color: #fafafa;
        padding-left: 10px;
        padding-right: 10px;
      "
    >
      <div>
        <div
          style="
            font-size: 22px;
            padding-top: 32px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          "
        >
          <img
            alt="logo"
            src="https://petrosianshoes.com/static/media/logo.8cca1b05.png"
            style="width: 200px; height: 40px;"
          />
        </div>

        <div>
          <h1
            style="
              text-align: center;
              font-family: Tahoma, sans-serif;
              font-size: 28px;
              color: #42454b;
            "
          >
            Dear <span>${fname} ${lname}</span>
          </h1>

          <div>
            <p
              style="
                text-align: center;
                font-family: Tahoma, sans-serif;
                font-size: 16px;
                max-width: 600px;
                box-sizing: border-box;
                margin: auto;
                color: #42454b;
                font-feature-settings: 'clig' off, 'liga' off;
                font-style: normal;
                font-weight: 500;
                line-height: 24px;
                letter-spacing: 1px;
              "
            >
              Great news! Your shoes are on their way. Get ready to step out in
              style! 🚚👟
            </p>
          </div>
        </div>

        <div
          style="
            margin: 60px auto auto;
            border-radius: 8px;
            background-color: #42454b;
            color: white;
            width: 100%;
            max-width: 600px;
            padding: 16px 32px;
            box-sizing: border-box;
          "
        >
          <p
            style="
              text-align: left;
              margin: 0;
              font-family: Tahoma, sans-serif;
            "
          >
            Shipping Information
          </p>
        </div>

        <table
          style="
            max-width: 600px;
            width: 100%;
            margin-top: 20px;
            margin-left: auto;
            margin-right: auto;
          "
        >
          <tr>
            <td style="padding-top: 32px;">
              <p style="margin: 0; font-weight: 700;">
                Courier service name:
              </p>
              <a href="${courierServiceLink}" style="display: block; color: #111; margin-top: 16px">
                ${courierServiceName}
              </p>
            </td>
            <td style="padding-top: 32px;">
              <p style="margin: 0; font-weight: 700;">
                Shipping tracking number:
              </p>
              <p style="margin-bottom: 0">
                ${shippingKey}
              </p>
            </td>
          </tr>
        </table>

        <p
          style="
            text-align: center;
            font-family: Tahoma, sans-serif;
            max-width: 600px;
            margin: 32px auto;
            background-color: white;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #eff3f6;
            box-sizing: border-box;
            font-size: 18px;
            line-height: 24px;
          "
        >
          Warm regards!
        </p>
      </div>

      <footer>
        <div
          style="
            width: 600px;
            margin: 0 auto;
            padding: 24px 16px 16px;
            background-color: white;
            border-radius: 8px 8px 0 0;
            box-sizing: border-box;
            text-align: center;
            border: 1px solid #eff3f6;
            border-bottom: 0;
          "
        >
          <a href="https://petrosianshoes.com/" target="_blank">
            <img
              alt="logo"
              src="https://petrosianshoes.com/static/media/logo.8cca1b05.png"
              style="width: 200px; height: 40px;"
            />
          </a>
        </div>
      </footer>
    </div>
    `
  )
}

module.exports.shippingKeyResponseTemplate = shippingKeyResponseTemplate
