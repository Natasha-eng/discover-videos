import { setTokenCookie } from "../../lib/cookies";
import { isNewUser, createNewUser } from "../../lib/db/hasura";
import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;

      const DIDToken = auth ? auth.substr(7) : "";

      // Retrieves user information by DID token
      const metadata = await magicAdmin.users.getMetadataByToken(DIDToken);

      //create jwt
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.JWT_SECRET,
        { algorithm: "HS256" }
      );

      //CHECK IF USER EXISTS
      const isNewUserQuery = await isNewUser(token, metadata.issuer);

      //create new user
      isNewUserQuery && (await createNewUser(token, metadata));

      //set the cookie
      setTokenCookie(token, res);

      res.send({ done: true, msg: "user logged in" });
    } catch (err) {
      res.status(500).send({ done: false });
      console.log("Something went wrong loggin in", err);
    }
  } else {
    res.send({ done: false });
  }
}
