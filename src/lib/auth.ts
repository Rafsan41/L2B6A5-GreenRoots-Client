import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER_EMAIL,
    pass: process.env.APP_USER_PASS,
  },
})

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: FRONTEND_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    FRONTEND_URL,
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "",
  ],
  user: {
    additionalFields: {
      role: { type: "string", required: false },
      image: { type: "string", required: false },
      phones: { type: "string", required: false },
      status: { type: "string", defaultValue: "ACTIVE", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = (user as any).role ?? "CUSTOMER"
          const status = role === "SELLER" ? "PENDING" : "ACTIVE"
          return { data: { ...user, role, status } }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const verificationUrl = `${FRONTEND_URL}/verify-email?token=${token}`

        const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Verify your email — GreenRoots</title></head>
<body style="margin:0;padding:0;background-color:#f5f2eb;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fefcf7;border-radius:4px;overflow:hidden;border:1px solid #d8c99a;">
        <tr>
          <td style="background:#152010;padding:36px 40px 30px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#d4c4a0;letter-spacing:2px;">GreenRoots</span>
            <p style="color:rgba(175,148,82,0.65);font-size:10px;margin:6px 0 0;letter-spacing:3px;font-family:'Courier New',monospace;text-transform:uppercase;">Rooted in Nature &middot; Delivered to You</p>
          </td>
        </tr>
        <tr><td style="height:3px;background:linear-gradient(90deg,#8a5a2a,#c8a45a,#8a5a2a);font-size:0;">&nbsp;</td></tr>
        <tr>
          <td style="padding:40px 44px 32px;">
            <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:normal;color:#1a2e10;margin:0 0 10px;">Verify your email address</h1>
            <p style="font-size:14px;color:#4a6040;margin:0 0 28px;line-height:1.7;">Hi ${user.name ?? "there"}, welcome to GreenRoots. Please confirm your email address to activate your account.</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:28px 0;">
                <a href="${verificationUrl}" style="display:inline-block;background:#152010;color:#d4c4a0;text-decoration:none;font-family:'Courier New',monospace;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:14px 40px;border-radius:2px;border:1px solid rgba(175,148,82,0.4);">Verify Email Address</a>
              </td></tr>
            </table>
            <p style="font-size:12px;color:#7a8a6a;margin:20px 0 6px;">If the button doesn't work, copy and paste this link:</p>
            <p style="font-size:11px;color:#4a6040;font-family:'Courier New',monospace;word-break:break-all;margin:0;background:#eef2e8;padding:10px 12px;border-radius:2px;border-left:3px solid #7ec85a;">${verificationUrl}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#faeeda;border-radius:2px;border-left:3px solid #c8a45a;padding:12px 14px;">
                  <p style="font-size:12px;color:#633806;margin:0;line-height:1.6;">&#9200; This link expires in <strong>24 hours</strong>.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f0ede4;border-top:1px solid #d8c99a;padding:20px 44px;text-align:center;">
            <p style="font-size:11px;color:#8a7a5a;margin:0;font-family:'Courier New',monospace;">GreenRoots &middot; support@greenroots.app</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

        await transporter.sendMail({
          from: '"GreenRoots" <noreply@greenroots.app>',
          to: user.email,
          subject: "Verify your GreenRoots email address",
          text: `Hi ${user.name ?? "there"},\n\nVerify your email: ${verificationUrl}\n\nExpires in 24 hours.\n\n— GreenRoots`,
          html: emailHtml,
        })
      } catch (err) {
        console.error("Error sending verification email:", err)
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${FRONTEND_URL}/api/auth/callback/google`,
    },
  },
})
