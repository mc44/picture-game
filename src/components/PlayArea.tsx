'use client';
import React, { useEffect, useState } from 'react'
import Image from "next/image"

interface ImageData {
  picture: string;
  name: string;
  id: number;
}

const PlayArea = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [seconds, setSeconds] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [winTime, setWinTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const importAll = (r: any) => {
    return r.keys().map((key: string, index: number) => ({
      picture: key.replace('./', ''),
      name: key.replace('./', '').split('.')[0],
      id: index + 1
    }));
  };

  useEffect(() => {
    if (level == 1) {
      const imagesArray = importAll(require.context('../../public/genshin_chibi', false, /\.(webp|jpg|png|jpe?g|svg)$/));
      const shuffledImages = shuffleArray(imagesArray);
      setImages(shuffledImages);
    } else if (level == 2) {
      setSelected([])
      const jumbleImages = jumbleArrayContents(images);
      setImages(jumbleImages);
    } else if (level == 3) {
      setWinTime(seconds);
      setShowModal(true);
    }
  }, [level]);

  const restart = () => {
    setScore(0);
    setHighScore(0);
    setSelected([]);
    setSeconds(0);
    setShowModal(false);
    setLevel(1);
  }

  const jumbleArrayContents = (array: ImageData[]) => {
    const names = array.map(item => item.name);

    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      newArray.push({
        name: names[i],
        picture: array[i].picture,
        id: i
      });
    }
    return newArray;
  };

  const shuffleArray = (array: ImageData[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleClick = (id: number) => {
    if (selected.includes(id)) {
      if (highScore < score) setHighScore(score);
      setScore(0);
      setSelected([]);
      setLevel(1);
      return;
    } else {
      setSelected(prevSelected => [...prevSelected, id]);
      setScore(score + 1);
      if (score == 11) { setLevel(2); return; }
      if (score == 23) { setLevel(3); return; }
    }
    const shuffledImages = shuffleArray(images);
    setImages(shuffledImages);
  }

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section className='mx-10 md:mx-20'>
      <div>
        Time: {formatTime(seconds)} <br />
        Level: {level} - {level == 1 && "Select each character once"} {level == 2 && "Names are now jumbled! Good luck!"} <br />
        Score: {score + '/24'} <br />
        Highscore: {highScore + '/24'}
      </div>
      <div className="image-list grid grid-cols-4 md:grid-cols-6 gap-3 ">
        {images.map(image => (
          <div key={image.id} className="image-item">
            <Image
              src={`/picture-game/genshin_chibi/${image.picture}`}
              onClick={() => handleClick(image.id)}
              alt={image.name}
              width={300}
              height={300}
            />
            <p className='text-xs lg:text-lg'>{image.name}</p>
          </div>
        ))}
      </div>
      <div
        className={`fixed bg-black inset-0 flex items-center justify-center ${showModal ? 'block' : 'hidden'
          }`}
      >
        <div className="p-8 rounded-lg border-white border-1 shadow-lg w-80">
          <h2 className="text-xl font-bold mb-4">Well played!</h2>
          Time taken = {formatTime(winTime)} <br /> <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={() => restart()}
          >
            Restart
          </button>
        </div>
      </div>
    </section>
  )
}

export default PlayArea
