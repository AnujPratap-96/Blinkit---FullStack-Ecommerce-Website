import SibApiV3Sdk  from "sib-api-v3-sdk"



const sendEmail = async (sendTo , subject, htmlContent) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

    const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailPayload = {
      to: [{ email: sendTo }],
      sender: {
        name: 'Blinkit',
        email: 'officialthakur94@gmail.com',
      },
      subject: subject,
      htmlContent: htmlContent,
    };

    await emailApi.sendTransacEmail(emailPayload);

  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Email send failed.");
  }
};


export default sendEmail;

