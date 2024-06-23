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
  const [highScore,setHighScore] = useState(0);
  const [images, setImages] = useState<ImageData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    const importAll = (r: any) => {
      return r.keys().map((key: string, index: number) => ({
        picture: key.replace('./', ''),
        name: key.replace('./', '').split('.')[0],
        id: index + 1
      }));
    };

    const imagesArray = importAll(require.context('../../public/genshin_chibi', false, /\.(webp|jpg|png|jpe?g|svg)$/));
    setImages(imagesArray);
  }, []);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleClick = (id: number) => {
    console.log(selected);
    if(selected.includes(id)){
      if(highScore<score) setHighScore(score);
      setScore(0);
      setSelected([]);
    }else{
      setSelected(prevSelected => [...prevSelected, id]);
      setScore(score+1);
    }
    const shuffledImages = shuffleArray(images);
    setImages(shuffledImages);
  }

  return (
    <section className='mx-10 md:mx-20'>
      <div>
        Score: {score} <br/>
        Highscore: {highScore}
      </div>
      <div className="image-list grid grid-cols-4 md:grid-cols-6 gap-3">
        {images.map(image => (
          <div key={image.id} className="image-item">
           <Image
              src={`/genshin_chibi/${image.picture}`}
              onClick={() => handleClick(image.id)}
              alt={image.name}
              width={300}
              height={300}
            />
            <p>{image.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PlayArea