import { createToken, verifyToken } from "../../auth/jwt_gen.js";

type Permission = {
  [key: string]: any;
};
export default async function setPermissions(
  oldRefreshToken: string,
  permissions: Array<string>
) {
  const token = await verifyToken(oldRefreshToken);
  let newPermissons: Permission;
  newPermissons = {};
  for (let i = 0; i < permissions.length; i++) {
    newPermissons[permissions[i]] = true;
  }

  const newPayload = Object.assign(token.data, newPermissons);
  const newToken = await createToken(newPayload, { algorithm: 'RS256', expiresIn: "100y" });
  return { token: newToken, data: newPayload };
}
