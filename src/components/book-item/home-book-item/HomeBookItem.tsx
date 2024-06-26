import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

const BookItemContentsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, display: "none" }}
      animate={{
        opacity: 1,
        scale: 1,
        display: "flex",
        transition: { delay: 0.3 },
      }}
      exit={{
        opacity: 0,
        scale: 0,
        transition: { duration: 0.1 },
      }}
      className="flex flex-col max-w-[70%] w-[350px] "
    >
      {children}
    </motion.div>
  );
};

const NotePreview = ({
  deps: { link, children, noteContents, favorite },
}: {
  deps: { [key: string]: any };
}) => {
  return (
    <motion.a
      href={link}
      className={`
       hover:cursor-pointer
       hover:shadow-book-item-active
       hover:transition-shadow
       transition-shadow
       hover:duration-200
       duration-200
       shadow-book-item
       gap-4 py-6 px-8
       min-w-[200px] min-h-[250px] max-w-[500px] w-full
       max-[1200px]:min-h-[230px]
       max-[1200px]:px-6
       max-[1200px]:py-4
       bg-white rounded-md
       box-content

        ${favorite !== "" ? "" : "favorite-book"} book-item-favorites

      `}
      key="contents"
      initial={{ opacity: 0, scale: 0, display: "none" }}
      animate={{
        scale: 1,
        opacity: 1,
        transition: {
          delay: 0.2,
        },
        display: "grid",
      }}
      exit={{
        opacity: 0,
        scale: 0,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">{children}</div>
        <div className=" h-full bg-black rounded p-3">
          <p className="max-[1200px]:text-[.8rem] max-[1200px]:leading-4 max-[1280px]:line-clamp-5  max-[1280px]:text-[1rem] text-white text-pretty note-contents-preview">
            {noteContents}
          </p>
        </div>
      </div>
    </motion.a>
  );
};

const HomeBookItem = ({
  color,
  motionKey,
  children,
  noteContents,
  link,
  animate = false,
  hide = false,
  favorite,
}: {
  animate?: boolean;
  color: string;
  motionKey: number;
  children?: ReactNode;
  noteContents?: string;
  link: string;
  hide?: boolean;
  favorite: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => {
        console.log("Entered");
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      key={motionKey}
      style={{ backgroundColor: color }}
      className={` max-lg:hidden px-10 home-book-item flex justify-center items-center  
      ${!animate && "cursor-pointer"}`}
    >
      <AnimatePresence custom="popLayout">
        {!isHovered ? (
          <BookItemContentsLayout key={"book"}>
            {children}
          </BookItemContentsLayout>
        ) : (
          <NotePreview deps={{ children, noteContents, link, favorite }} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomeBookItem;
