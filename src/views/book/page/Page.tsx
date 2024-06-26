import { useOutletContext, useParams } from "react-router-dom";
import {
  t_note,
  t_page,
  t_currentPage,
  t_book,
  t_extendedNote,
} from "../../../types/t_library";
import { useEffect, useRef, useState } from "react";
import getRelatedItems from "../../../utils/getRelatedItems";
import { AnimatePresence } from "framer-motion";
import Note from "../../../components/Notes";
import { uid } from "uid";
import PageHeader from "../../../components/PageHeader";
import LibraryStorage from "../../../utils/Library";
import PageNavigator from "../../../components/PageNavigator";
import RemoveConfirmation from "../../../components/modal/RemoveConfirmation";

const Page = () => {
  const { bookAuthor, bookTitle, addPage, removePage } = useOutletContext<{
    bookTitle: string;
    bookAuthor: string;
    addPage: () => void;
    removePage: () => void;
  }>();
  const { pageID } = useParams<any>();
  const [pageData, setPageData] = useState<t_currentPage | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  function addNote() {
    const newID = uid(16);
    if (pageData) {
      const newNote: t_note = {
        index: pageData.notes.length === 0 ? 0 : pageData.notes.length,
        bookID: pageData?.currentPage.bookID as string,
        pageID: pageData?.currentPage.id as string,
        noteNum: pageData?.notes.length + 1,
        contents: `This is a new note. \nHere is my note ID: ${newID}`,
        dateAdded: new Date().toString(),
        lastUpdated: new Date().toString(),
        id: newID,
      };
      setPageData(
        (prev) =>
          ({ ...prev, notes: [...pageData.notes, newNote] }) as t_currentPage,
      );
      LibraryStorage.addNote(newNote);
      window.scrollTo(0, 1000000);
    }
  }

  function removeNote(noteID: string) {
    if (pageData) {
      const currentNote = pageData.notes.find((note) => note.id === noteID);
      const filterNotes = pageData.notes.filter((note) => note.id !== noteID);
      setPageData(
        (prev) => ({ ...prev, notes: [...filterNotes] }) as t_currentPage,
      );
      LibraryStorage.removeNote(currentNote as t_note);
    }
  }

  function editNote(contents: string, noteID: string) {
    if (pageData) {
      const updateDate = new Date().toString();
      const currentNote = pageData.notes.find(
        (note) => note.id === noteID,
      ) as t_extendedNote;

      const currentUpdatedNote = {
        ...currentNote,
        contents,
        lastUpdated: updateDate,
      };

      const updatedNotes: t_extendedNote[] = pageData?.notes.map((note) => {
        if (note.id !== noteID) return note;
        return currentUpdatedNote;
      });

      setPageData({
        ...pageData,
        currentPage: { ...pageData.currentPage, lastUpdated: updateDate },
        notes: updatedNotes,
      });

      delete currentUpdatedNote["isEditing"];
      LibraryStorage.updateNote(currentUpdatedNote);
    }
  }

  function handlePageEdit(newPageNum: number) {
    const updateCurrentPage: t_page = {
      ...(pageData?.currentPage as t_page),
      pageNum: newPageNum,
    };
    setPageData(
      (prev) =>
        ({
          ...prev,
          currentPage: { ...updateCurrentPage },
        }) as t_currentPage,
    );
    LibraryStorage.updatePage(updateCurrentPage);
  }

  function onDragStart(e: any): void {
    const target = e.currentTarget;
    e.dataTransfer.setData("text/plain", target.id);
  }

  function onDrop(e: any): void {
    const transferedData = e.dataTransfer.getData("text/plain");
    const target = e.currentTarget;
    const classChangeTarget = e.target;

    if (classChangeTarget.classList.contains("droppable")) {
      classChangeTarget.classList.remove("droppable");
      classChangeTarget.classList.add("dropped");
      setTimeout(() => {
        classChangeTarget.classList.remove("dropped");
      }, 500);
    }
    updateNotePosition(transferedData, target.id);
  }

  function updateNotePosition(transferedData: string, id: string) {
    if (pageData) {
      const [currentTarget, dropTarget]: Array<t_note> = pageData?.notes.filter(
        (note) => note.id === transferedData || note.id === id,
      );

      // when saving im rearranging the position of the objects in the notes array
      // instead of changing their indexes
      const updateNotePosition: Array<t_note> = pageData?.notes.map((note) => {
        if (dropTarget.id === note.id) {
          // matches the drop target Id and updates the drop target's data with the current target
          // swapped the drop targets contents with the current target
          LibraryStorage.updateNote({
            ...currentTarget,
            index: dropTarget.index,
            noteNum: dropTarget.noteNum,
          });
          return { ...currentTarget, noteNum: dropTarget.noteNum };
        }
        if (currentTarget.id === note.id) {
          LibraryStorage.updateNote({
            ...dropTarget,
            index: currentTarget.index,
            noteNum: currentTarget.noteNum,
          });
          return { ...dropTarget, noteNum: currentTarget.noteNum };
        }
        return note;
      });
      setPageData(
        (prev) =>
          ({ ...prev, notes: [...updateNotePosition] }) as t_currentPage,
      );
    }
  }

  // set as loader
  function getPageData(storage: Array<t_page>) {
    const [currentPage] = storage.filter((page) => page.id === pageID);
    if (currentPage === undefined) {
      return;
    }
    console.log(currentPage);
    const getPageNotes = getRelatedItems<t_note>(
      currentPage.noteIDs,
      LibraryStorage.notes,
      (notes) => {
        return notes.map((note) => ({ ...note, isEditing: false }));
      },
    );
    const currentPageData: t_currentPage = {
      book: {
        title: bookTitle,
        author: bookAuthor,
      },
      currentPage,
      notes: getPageNotes.sort(
        (a, b) => a.noteNum - b.noteNum,
      ) as Array<t_extendedNote>,
    };
    setPageData({ ...currentPageData });
  }

  function handleHeaderTransition() {
    setIsScrolling(true);
    if (window.scrollY <= 150) {
      setIsScrolling(false);
    }
  }

  useEffect(() => {
    getPageData(LibraryStorage.pages);
  }, [pageID]);

  useEffect(() => {
    window.addEventListener("scroll", handleHeaderTransition);
    return window.removeEventListener("scroll", () => {
      console.log("throw");
    });
  }, []);

  const renderNotes = pageData?.notes.map((note) => {
    return (
      <Note
        index={note.index}
        handleSave={editNote}
        handleCancelNoteEdit={disableEditNote}
        dragEvents={{ onDragStart, onDrop }}
        key={note.id}
        id={note.id}
        note={note}
        contents={note.contents}
        isEditing={note.isEditing}
      />
    );
  });

  function isCurrentlyEditing(noteID: string) {
    const [editingNote]: any = pageData?.notes.filter(
      (note) => note.id === noteID,
    );
    return editingNote.isEditing ? true : false;
  }

  function triggerEditNote(noteID: string) {
    const setEditingNote = pageData?.notes.map((note) => {
      if (note.id === noteID) return { ...note, isEditing: true };
      return { ...note, isEditing: false };
    });
    setPageData((prev) => ({
      ...(prev as t_currentPage),
      notes: [...(setEditingNote as Array<t_extendedNote>)],
    }));
  }

  function disableEditNote(): void {
    const checkIfEditing = pageData?.notes.some(
      (note) => note.isEditing === true,
    );
    console.log(checkIfEditing);
    if (!checkIfEditing) return;
    const setEditingNote = pageData?.notes.map((note) => ({
      ...note,
      isEditing: false,
    }));
    setPageData((prev) => ({
      ...(prev as t_currentPage),
      notes: [...(setEditingNote as Array<t_extendedNote>)],
    }));
  }

  return (
    <div
      id="page"
      className=" outline-none w-[80%] max-md:w-[90%] max-w-[1440px] flex flex-col justify-start max-sm:mx-0 max-sm:my-2 mx-16 my-8"
      ref={pageRef}
      tabIndex={0}
      onKeyDown={(e: any) => {
        if (e.key === "Escape") disableEditNote();
      }}
      onClick={(e: any) => {
        const target = e.target;
        const targetID = target.id.slice(7);
        if (target.classList.contains("edit-btn")) {
          if (!isCurrentlyEditing(targetID)) {
            triggerEditNote(targetID);
          }
        }

        if (target.classList.contains("trash-btn")) {
          removeNote(targetID);
        }
      }}
    >
      {pageData !== null && isModalOpen && (
        <RemoveConfirmation
          isOpen={isModalOpen}
          modalSetter={setIsModalOpen}
          handleConfirmDelete={removePage}
          data={{
            num: pageData.currentPage.pageNum,
            numberOfNotes: pageData.notes.length,
            type: "Page",
          }}
        />
      )}
      {pageData && (
        <PageHeader
          bookTitle={bookTitle}
          bookAuthor={bookAuthor}
          pageData={pageData as t_currentPage}
          handleOnAddNote={addNote}
          handleOnAddPage={addPage}
          handleOnEditPage={handlePageEdit}
          handleRemovePageModal={() => {
            setIsModalOpen(true);
          }}
          isScrolling={isScrolling}
        />
      )}
      <section
        className={` ${
          isScrolling ? "mt-[35%]" : ""
        } min-w-[100%] flex-1 overflow-hidden`}
      >
        <div id="notes-container" className={` justify-start px-2 py-2 `}>
          {renderNotes?.length === 0 ? (
            <p className=" text-gray-200 font-semibold ">
              Add a note to get started.
            </p>
          ) : (
            <AnimatePresence custom={"popLayout"}>
              {renderNotes}
            </AnimatePresence>
          )}
        </div>
      </section>
      <PageNavigator currentPageNum={pageData?.currentPage.pageNum as number} />
    </div>
  );
};

export default Page;
