import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { createId } from "@paralleldrive/cuid2";
import { User } from "@prisma/client";
import { ERROR_MESSAGE, processUsername } from "@reactive-resume/utils";
import { Strategy } from "passport-microsoft";

import { UserService } from "@/server/user/user.service";

type MicrosoftProfile = {
  id: string;
  displayName?: string;
  emails?: { value: string }[];
  username?: string;
};

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, "microsoft") {
  constructor(
    readonly clientID: string,
    readonly clientSecret: string,
    readonly callbackURL: string,
    private readonly userService: UserService,
  ) {
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["user.read", "email", "openid", "profile"],
      tenant: "common",
      // tenant: ["openid", "profile", "email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: MicrosoftProfile,
    done: (err?: string | Error | null, user?: Express.User, info?: unknown) => void,
  ) {
    const { displayName, emails, username } = profile;
    const email = (emails?.[0].value ?? `${username}@microsoft.com`).toLocaleLowerCase();

    let user: User | null = null;

    if (!email) throw new BadRequestException(ERROR_MESSAGE.InvalidCredentials);

    try {
      user =
        (await this.userService.findOneByIdentifier(email)) ??
        (username ? await this.userService.findOneByIdentifier(username) : null);

      if (!user) throw new BadRequestException(ERROR_MESSAGE.InvalidCredentials);

      done(null, user);
    } catch {
      try {
        user = await this.userService.create({
          email,
          picture: null, // Microsoft doesn't always return profile pictures
          locale: "en-US",
          provider: "microsoft",
          name: displayName ?? createId(),
          emailVerified: true,
          username: processUsername(username ?? email.split("@")[0]),
          secrets: { create: {} },
        });

        done(null, user);
      } catch (error) {
        Logger.error(error);
        throw new BadRequestException(ERROR_MESSAGE.UserAlreadyExists);
      }
    }
  }
}
