import Head from "next/head";

import Banner from "../components/banner/banner";
import NavBar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";

import {
  getPopularVideos,
  getVideos,
  getWatchItAgainVideos,
} from "../lib/videos";

import redirectUser from "../utils/redirectUser";

import styles from "../styles/Home.module.css";
import { verifyToken } from "../lib/utils";

export async function getServerSideProps(context) {
  const { userId, token } = await redirectUser(context);

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();
  return {
    props: {
      disneyVideos,
      travelVideos,
      productivityVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
  popularVideos,
  watchItAgainVideos = [],
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <NavBar />
        <Banner
          videoId="kpGo2_d3oYE"
          title="The Little Mermaid"
          subTitle="Life Is The Bubbles"
          imgUrl="./static/The-Little-Mermaid.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch It Again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
