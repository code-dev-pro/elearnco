import { Divider, Image } from "@nextui-org/react";
import React from "react";

const articles = [
  {
    id: "article_1",
    title: "Editor Image",
    description: "You can change your image by resizing or crop it.",
    photo: "/features/crop.png",
    date: "",
  },
  {
    id: "article_2",
    title: "Editor Image",
    description: "You can change your image by resizing or crop it.",
    photo: "/features/crop.png",
    date: "",
  },
];

const Features = () => {
  return (
    <div>
      {articles.map((article) => (
        <React.Fragment key={article.id}>
          <div>
            <h2 className="mb-2">{article.title}</h2>
            <Image width={500} alt={article.title} src={article.photo} />
            <p className="mt-2">{article.description}</p>
          </div>
          <Divider className="mt-5 mb-5"/>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Features;
