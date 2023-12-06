import { verifyToken } from "../lib/utils";

const redirectUser = async (context) => {
  let token = context.req ? context.req.cookies?.token : null;
  const userId = await verifyToken(token);
  return {
    userId,
    token,
  };
};

export default redirectUser;
