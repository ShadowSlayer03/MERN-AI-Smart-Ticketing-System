import inngest from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import { htmlOnBoardingTemplate, subject } from "../../utils/constants.js";

export const onUserSignUp = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const user = await step.run("get-user-email", async () => {
        const userFound = await User.findOne({ email });
        if (!userFound) {
          throw new NonRetriableError("User no longer exists in the DB!");
        }
        return userFound;
      });

      await step.run("send-welcome-email", async () => {
        await sendMail(user.email, subject, htmlOnBoardingTemplate);
      });

      return { success: true };
    } catch (error) {
      console.error("on-user-signup function failed:", error.message);
      return { success: false };
    }
  }
);
