import { t } from "@lingui/macro";
import { ERROR_MESSAGE } from "@reactive-resume/utils";

export const translateError = (error: ERROR_MESSAGE) => {
  switch (error) {
    case ERROR_MESSAGE.InvalidCredentials: {
      return t`It doesn't look like a user exists with the credentials you provided.`;
    }
    case ERROR_MESSAGE.UserAlreadyExists: {
      return t`A user with this email address and/or username already exists.`;
    }
    case ERROR_MESSAGE.SecretsNotFound: {
      return t`User does not have an associated 'secrets' record. Please report this issue on GitHub.`;
    }
    case ERROR_MESSAGE.OAuthUser: {
      return t`This email address is associated with an OAuth account. Please sign in with your OAuth provider.`;
    }
    case ERROR_MESSAGE.InvalidResetToken: {
      return t`It looks like the reset token you provided is invalid. Please try restarting the password reset process again.`;
    }
    case ERROR_MESSAGE.InvalidVerificationToken: {
      return t`It looks like the verification token you provided is invalid. Please try restarting the verification process again.`;
    }
    case ERROR_MESSAGE.EmailAlreadyVerified: {
      return t`It looks like your email address has already been verified.`;
    }
    case ERROR_MESSAGE.TwoFactorNotEnabled: {
      return t`Two-factor authentication is not enabled for this account.`;
    }
    case ERROR_MESSAGE.TwoFactorAlreadyEnabled: {
      return t`Two-factor authentication is already enabled for this account.`;
    }
    case ERROR_MESSAGE.InvalidTwoFactorCode: {
      return t`It looks like the two-factor authentication code you provided is invalid. Please try again.`;
    }
    case ERROR_MESSAGE.InvalidTwoFactorBackupCode: {
      return t`It looks like the backup code you provided is invalid or used. Please try again.`;
    }
    case ERROR_MESSAGE.InvalidBrowserConnection: {
      return t`There was an error connecting to the browser. Please make sure 'chrome' is running and reachable.`;
    }
    case ERROR_MESSAGE.ResumeSlugAlreadyExists: {
      return t`A resume with this alias already exists, please pick a different unique identifier.`;
    }
    case ERROR_MESSAGE.ResumeNotFound: {
      return t`It looks like the resume you're looking for doesn't exist.`;
    }
    case ERROR_MESSAGE.ResumeLocked: {
      return t`The resume you want to update is locked, please unlock if you wish to make any changes to it.`;
    }
    case ERROR_MESSAGE.ResumePrinterError: {
      return t`Something went wrong while printing your resume. Please try again later or raise an issue on GitHub.`;
    }
    case ERROR_MESSAGE.ResumePreviewError: {
      return t`Something went wrong while grabbing a preview your resume. Please try again later or raise an issue on GitHub.`;
    }
    case ERROR_MESSAGE.SomethingWentWrong: {
      return t`Something went wrong while processing your request. Please try again later or raise an issue on GitHub.`;
    }

    default: {
      return null;
    }
  }
};
