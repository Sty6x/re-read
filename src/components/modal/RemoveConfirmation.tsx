import { useEffect, useRef } from "react";

type DialogProps = {
  handleConfirmDelete: () => void;
  isOpen: boolean;
  modalSetter: React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    num?: number;
    contents?: string;
    numberOfNotes?: number;
    type: "Note" | "Page" | "Book";
  };
};
const RemoveConfirmation = ({
  handleConfirmDelete,
  modalSetter,
  isOpen,
  data: { num, contents, numberOfNotes, type },
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      return;
    }
    dialogRef.current?.close();
  }, [isOpen]);

  return (
    <dialog
      onClose={() => {
        console.log("closed");
        modalSetter(false);
      }}
      ref={dialogRef}
      className="flex z-20 flex-col rounded-sm overflow-hidden"
    >
      <div className="px-6 pt-6">
        <div className="mb-1">
          <div className=" font-bold text-xl">
            You're about to <span className="text-pallete-danger">delete</span>{" "}
            <span className="text-accent-three">
              {num !== undefined ? `${type} #${num}` : contents}
            </span>
          </div>
          <div className="text-sm">This action cannot be undone.</div>
        </div>
      </div>
      <div className="flex p-6">
        <div className="ml-auto">
          <button
            onClick={() => {
              modalSetter(false);
            }}
            className="hover:underline "
          >
            Cancel
          </button>
          <button
            onClick={() => {
              modalSetter(false);
              handleConfirmDelete();
            }}
            className="font-bold hover:underline text-white px-3 py-2 bg-pallete-danger rounded-sm ml-3"
          >
            Confirm
          </button>{" "}
        </div>
      </div>
    </dialog>
  );
};

export default RemoveConfirmation;
