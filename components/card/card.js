import Image from "next/image";
import { useState } from "react";

import cls from "classnames";
import { motion } from "framer-motion";

import styles from "./card.module.css";

const Card = (props) => {
  const {
    imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size = "medium",
    shouldScale = true,
  } = props;
  const [imgSrc, setImgSrc, id] = useState(imgUrl);

  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  const handleError = () => {
    setImgSrc(
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
  };

  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const shouldHover = shouldScale && {
    whileHover: { ...scale },
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        {...shouldHover}
      >
        <Image
          className={styles.cardImg}
          src={imgSrc}
          alt="image"
          onError={handleError}
          fill={true}
          sizes="(max-width: 768px) 100%s, (max-width: 1200px) 100%"
        />
      </motion.div>
    </div>
  );
};

export default Card;
