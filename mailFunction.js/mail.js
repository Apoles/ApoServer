import mail from "nodemailer";
import sgMail from "@sendgrid/mail";

export async function SendMail(to, subject, text, html) {
  sgMail.setApiKey(
    "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"
  );

  const msg = {
    to: "800kleesin@gmail.com", // Change to your recipient
    from: "apolesgm@yandex.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  /*
  const transporter = mail.createTransport({
    direct: true,
    host: "smtp.yandex.com",
    port: 465,
    auth: {
      user: "apolesgm@yandex.com",
      pass: "nnmfumoahizxclum",
    },
    secure: true,
  });
  const transporterTwo = mail.createTransport({
    service: "gmail",
    auth: {
      user: "edaerdemoffical@gmail.com",
      pass: "bbhlqvnkxehzcctn",
    },
  });

  const mailOptions = {
    // Hangi sağlayıcıyı kullanıyorsanız onun bilgilerini girmelisiniz.
    from: `"deneme maili" <apolesgm@yandex.com>`,
    to: "emine176gumus@gmail.com",
    subject: `Burası başlık kısmı`,
    text: `Buraya text girebilirsiniz..`,
  };
  const mailOptionsTwo = {
    // Hangi sağlayıcıyı kullanıyorsanız onun bilgilerini girmelisiniz.
    from: `"Aysenur Gümüş" <edaerdemoffical@gmail.com>`,

    subject: `HACKLENDİN`,
    text: `Aysenur tarafından hacklendin`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else console.log("mail gönderildimi acabaaaa?");
  });*/
}
