import React, { useState } from "react";
import { Participant } from "../../App.schema";
import "./addPlayer.css";

interface AddPlayerProps {
  onAddPlayer?: (player: Participant) => void;
}

export const AddPlayer: React.FC<AddPlayerProps> = (props: AddPlayerProps) => {
  const [showAdd, setShowAdd] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [schools, setSchools] = useState<Array<{ name: string; id: string }>>([
    { name: "", id: "" },
  ]);

  const handleAddSchool = () => {
    setSchools([...schools, { name: "", id: "" }]);
  };

  const handleSchoolChange = (
    index: number,
    field: "name" | "id",
    value: string
  ) => {
    const newSchools = [...schools];
    newSchools[index][field] = value;
    setSchools(newSchools);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      alert("Please enter a player name");
      return;
    }

    const validSchools = schools.filter((s) => s.name && s.id);
    if (validSchools.length === 0) {
      alert("Please add at least one school with name and ID");
      return;
    }

    const newPlayer: Participant = {
      name: playerName,
      schools: validSchools,
      score: 0,
    };

    if (props.onAddPlayer) {
      props.onAddPlayer(newPlayer);
    }

    // Reset form
    setPlayerName("");
    setSchools([{ name: "", id: "" }]);
    setShowAdd(false);
  };

  return (
    <div className="addPlayer">
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)}>Add player</button>
      ) : (
        <form onSubmit={handleSubmit} className="add-player-form">
          <h3>Add New Player</h3>
          <div className="form-group">
            <label>Player Name:</label>
            <input
              type="text"
              name="name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
            />
          </div>

          <div className="schools-section">
            <label>Schools:</label>
            {schools.map((school, index) => (
              <div key={index} className="school-input-group">
                <input
                  type="text"
                  placeholder="School name"
                  value={school.name}
                  onChange={(e) =>
                    handleSchoolChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Team ID"
                  value={school.id}
                  onChange={(e) =>
                    handleSchoolChange(index, "id", e.target.value)
                  }
                />
              </div>
            ))}
            <button type="button" onClick={handleAddSchool} className="add-school-btn">
              + Add Another School
            </button>
          </div>

          <div className="form-actions">
            <button type="submit">Save Player</button>
            <button type="button" onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
