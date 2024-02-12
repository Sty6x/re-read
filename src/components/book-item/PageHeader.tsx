import { motion } from "framer-motion";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { t_currentPage } from "../../types/t_library";

const PageHeader = ({
  isScrolling,
  pageData,
  handleOnAddNote,
  handleOnAddPage,
}: {
  isScrolling: boolean;
  pageData: t_currentPage;
  handleOnAddNote: () => void;
  handleOnAddPage: () => void;
}) => {
  const { bookID } = useParams();

  const { addPage } = useOutletContext<{
    addPage: (currentPageID: string | Array<string>) => void;
  }>();
  return (
    <header
      className={`z-20 sticky top-0 border-b-black border-solid bg-white bg-gridWhite py-6`}
    >
      <Link to={"/library"} className="underline text-lg">
        Go back to library
      </Link>
      <Link to={`/${bookID}`}>
        <div className="w-[fit-content]">
          <span>
            <h1
              className={`
              ${isScrolling ? "text-4xl" : "text-7xl"}
               font-bold drop-shadow-text-shadow`}
            >
              {pageData?.book.title}
            </h1>
          </span>
          <span>
            <p
              className={`
              ${isScrolling ? "text-lg" : "text-2xl"}
            font-semibold drop-shadow-text-shadow`}
            >
              by {pageData?.book.author}
            </p>
          </span>
        </div>
      </Link>
      <p
        className={`drop-shadow-text-shadow 
              ${isScrolling ? "text-md" : "text-xl"}`}
      >
        Page {pageData?.currentPage.pageNum}
      </p>
      <div className={`flex gap-4 mt-3`}>
        <motion.span whileHover={{ x: 5 }} className="w-[max-content]">
          <button
            onClick={() => {
              handleOnAddNote();
            }}
            type="button"
            className={`
            ${isScrolling ? "text-md" : "text-xl"}
            drop-shadow-text-shadow add-icon w-full before:mr-[.3em] items-center before:h-[20px] relative flex content-center py-1 `}
          >
            Add Note
          </button>
        </motion.span>

        <motion.span whileHover={{ x: 5 }} className=" w-[max-content]">
          <button
            className={`
            ${isScrolling ? "text-md" : "text-xl"}
            drop-shadow-text-shadow add-icon w-full before:mr-[.3em] items-center before:h-[20px] relative flex content-center py-1`}
            onClick={() => {
              handleOnAddPage();
            }}
          >
            Add Page
          </button>
        </motion.span>
      </div>
    </header>
  );
};

export default PageHeader;
