import { HttpErrors, Request } from "@loopback/rest";
import { AuthenticationStrategy } from "@loopback/authentication";
import { UserProfile } from "@loopback/security";

export class Auth0Strategy implements AuthenticationStrategy {
    name: string = "auth0";

    async authenticate(request: Request): Promise<UserProfile> {
        const token = this.extractCredentials(request);

        return {} as any;
    }

    private extractCredentials(request: Request) {
        if (request.headers.authorization) {
            // for example: Bearer xyz
            const authHeaderValue = request.headers.authorization;

            if (!authHeaderValue.startsWith("Bearer")) {
                throw new HttpErrors.Unauthorized(
                    `Authorization header is not of type 'Bearer'.`
                );
            }

            //split the string into 2 parts: 'Bearer ' and the `xyz`
            const parts = authHeaderValue.split(" ");
            if (parts.length !== 2) {
                throw new HttpErrors.Unauthorized(
                    `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`
                );
            }

            return parts[1];
        } else if (request.query.access_token) {
            // for example: xyz
            const authHeaderValue = request.query.access_token as string;

            return authHeaderValue;
        } else {
            throw new HttpErrors.Unauthorized(
                `Authorization header not found.`
            );
        }
    }
}