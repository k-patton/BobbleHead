import React, { useState } from "react";
import { Participant } from "../../App.schema";

interface AddPlayerProps {
  onDone?: () => void;
}

export const AddPlayer: React.FC<AddPlayerProps> = (props: AddPlayerProps) => {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div className="addPlayer">
      <button
        onClick={() => {
          setShowAdd(true);
        }}
      >
        Add player
      </button>
      {showAdd && (
        <form>
          <input
            type="text"
            name="name"
            onChange={(e) => {
              console.log("hi", e.target.value);
            }}
          />
        </form>
      )}
    </div>
  );
};
