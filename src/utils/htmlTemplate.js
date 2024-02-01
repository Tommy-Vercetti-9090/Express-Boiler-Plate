export const templateForCredentials = (email, password) => {
  // const { email, password } = data;
  if (!email || !password) {
    return {
      error: true,
      message: "Email or password is missing",
    };
  }
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          .email-container {
              background-color: #f3f3f3;
              width: 100%;
              padding: 20px;
              box-sizing: border-box;
          }
          .email-content {
              background-color: #ffffff;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
              border: 1px solid #dddddd;
              box-sizing: border-box;
          }
          .header {
              font-size: 24px;
              color: #333333;
              margin-bottom: 10px;
          }
          .body-text {
              font-size: 16px;
              color: #333333;
              margin-bottom: 20px;
          }
          .footer {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-content">
              <div class="header">Dog-Squad Account Information</div>
              <p class="body-text">Hello,</p>
              <p class="body-text">Your account details are as follows:</p>
              <p class="body-text"><strong>Email:</strong> ${email}</p>
              <p class="body-text"><strong>Password:</strong> ${password}</p>
              <p class="footer">This is an automated message from Dog-Squad. Please do not reply.</p>
          </div>
      </div>
  </body>
  </html>
`;
};

export const forgetPasswordTemplate = (Opts) => {
  return `<!doctype html>
    <html lang="en-US">
    
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>KC-Elite - Forget Password</title>
        <meta name="description" content=" - Forget Password.">
        <style type="text/css">
            a:hover {
                text-decoration: underline !important;
            }
        </style>
    </head>
    
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                                <!-- <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                              </a> -->
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1
                                                style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                               Forget Password</h1>
    
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            
                                            <p></p>
                                            <h4 style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                              OTP: ${Opts}
                                            </h4>
                                           
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
    
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    
    </html>`;
};
