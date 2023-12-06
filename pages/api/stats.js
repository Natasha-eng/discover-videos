import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).send({});
    } else {
      const inpurtParams = req.method === "POST" ? req.body : req.query;
      const { videoId } = inpurtParams;

      if (videoId) {
        const userId = await verifyToken(token);
        const findVideo = await findVideoIdByUser(token, userId, videoId);
        const doesStatsExists = findVideo?.length > 0;

        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;
          if (doesStatsExists) {
            //update video
            const response = await updateStats(token, {
              favourited,
              userId,
              videoId,
              watched,
            });
            res.send({ data: response });
          } else {
            //add video
            const response = await insertStats(token, {
              favourited,
              userId,
              videoId,
              watched,
            });
            res.send({ data: response });
          }
        } else {
          if (doesStatsExists) {
            res.send(findVideo);
          } else {
            res.status(404);
            res.send({ user: null, msg: "Video not found" });
          }
        }
      }
    }
  } catch (error) {
    console.log("Error occured /stats", error);
    res.status(500).send({ done: false, error: error?.message });
  }
}
