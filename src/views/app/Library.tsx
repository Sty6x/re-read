import { useOutletContext } from "react-router-dom";
import BookItemList from "../../components/BookItemList";
import { t_appItems } from "../../types/context";

const Library = () => {
  const {
    renderItems: { renderAllBooks, renderRecentBooks },
  } = useOutletContext<t_appItems<React.ReactNode>>();
  return (
    <section id="library-page" className="flex flex-col gap-16">
      <BookItemList
        link="recent-books"
        linkName="Recent Books"
        bookItems={renderRecentBooks}
        headerTitle="
      Here are the recent books you've read."
      />

      <BookItemList
        addLink={false}
        bookItems={renderAllBooks}
        headerTitle="Explore more of your books."
      />
    </section>
  );
};

export default Library;