import Link from "next/link";

import Card from "./card";

import cls from "classnames";
import styles from "./section-cards.module.css";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(shouldWrap && styles.wrap, styles.cardWrapper)}>
        {videos.map((video, i) => {
          return (
            <Link key={i} href={`/video/${video.id}`} passHref>
              <Card
                id={i}
                imgUrl={video.imgUrl}
                size={size}
                shouldScale={shouldScale}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
