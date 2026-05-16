import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase/config";
import { activities } from "./data/activities";

function App() {

  const [selectedPlayer, setSelectedPlayer] =
    useState("Anu");

  const [selectedActivity, setSelectedActivity] =
    useState(activities[0]);

  const [gameData, setGameData] =
    useState(null);

  // LEVEL LOGIC
  const getLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };

  // PROGRESS INSIDE CURRENT LEVEL
  const getProgress = (points) => {
    return points % 100;
  };

  // REALTIME FIRESTORE LISTENER
  useEffect(() => {

    const gameRef = doc(
      db,
      "games",
      "currentGame"
    );

    const unsubscribe = onSnapshot(
      gameRef,
      (snapshot) => {
        setGameData(snapshot.data());
      }
    );

    return () => unsubscribe();

  }, []);

  if (!gameData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // ADD POINTS
  const handleAddProgress = async () => {

    const gameRef = doc(
      db,
      "games",
      "currentGame"
    );

    const currentPoints =
      gameData[selectedPlayer].points;

    const oldLevel =
      getLevel(currentPoints);

    const newPoints =
      currentPoints +
      selectedActivity.points;

    const newLevel =
      getLevel(newPoints);

    await updateDoc(gameRef, {
      [`${selectedPlayer}.points`]:
        newPoints,
    });

    // LEVEL COMPLETION POPUP
    if (newLevel > oldLevel) {

      const winner =
        gameData.Anu.points >
        gameData.Potu.points
          ? "🏆 Anu"
          : "🏆 Potu";

      alert(`
🎉 Level ${oldLevel} Completed!

Winner:
${winner}
      `);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-5xl font-bold mb-10">
        🏁 Study Race
      </h1>

      <div className="space-y-6">

        {/* ANU */}
        <div className="bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold">
            🚗 Anu
          </h2>

          <div className="w-full bg-zinc-700 h-6 rounded-full mt-4 overflow-hidden">

            <div
              className="bg-green-500 h-6 transition-all duration-500"
              style={{
                width: `${getProgress(
                  gameData.Anu.points
                )}%`,
              }}
            />

          </div>

          <p className="mt-2 text-lg">
            {gameData.Anu.points} Points
          </p>

          <p className="text-sm text-zinc-400">
            Level {getLevel(gameData.Anu.points)}
          </p>

        </div>

        {/* POTU */}
        <div className="bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold">
            🏎️ Potu
          </h2>

          <div className="w-full bg-zinc-700 h-6 rounded-full mt-4 overflow-hidden">

            <div
              className="bg-blue-500 h-6 transition-all duration-500"
              style={{
                width: `${getProgress(
                  gameData.Potu.points
                )}%`,
              }}
            />

          </div>

          <p className="mt-2 text-lg">
            {gameData.Potu.points} Points
          </p>

          <p className="text-sm text-zinc-400">
            Level {getLevel(gameData.Potu.points)}
          </p>

        </div>

        {/* FORM */}
        <div className="mt-10 bg-zinc-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold mb-4">
            Add Progress
          </h2>

          <div className="flex flex-col gap-4">

            {/* PLAYER */}
            <select
              value={selectedPlayer}
              onChange={(e) =>
                setSelectedPlayer(
                  e.target.value
                )
              }
              className="p-3 rounded-lg bg-zinc-800"
            >

              <option value="Anu">
                Anu
              </option>

              <option value="Potu">
                Potu
              </option>

            </select>

            {/* ACTIVITY */}
            <select
              onChange={(e) => {

                const activity =
                  activities.find(
                    (a) =>
                      a.label ===
                      e.target.value
                  );

                setSelectedActivity(
                  activity
                );

              }}
              className="p-3 rounded-lg bg-zinc-800"
            >

              {activities.map(
                (activity) => (

                  <option
                    key={activity.label}
                    value={activity.label}
                  >

                    {activity.label}
                    (+{activity.points})

                  </option>
                )
              )}

            </select>

            <button
              onClick={handleAddProgress}
              className="bg-green-500 hover:bg-green-600 p-3 rounded-lg font-bold"
            >
              Add Progress
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;