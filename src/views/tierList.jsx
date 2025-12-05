import "../tierList.css";

import React, { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";

import { SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";

// CHIP DRAGGABLE ---------------------------------------------------------

function Chip({ chip }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chip.id });

  return (
    <div
      className="chip"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
      }}
    >
      <img src={chip.img} alt={chip.name} />
    </div>
  );
}

// DROPPABLE ZONE ---------------------------------------------------------

function Zone({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="tier-dropzone"
      style={{
        background: isOver ? "#d0ffd0" : "white",
        minHeight: 150, // 🔥 augmente la taille de la zone
        display: "flex", // pour que les chips s'affichent en ligne
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        padding: 5,
      }}
    >
      {children}
    </div>
  );
}

// MAIN COMPONENT ---------------------------------------------------------

export default function TierList() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeChip, setActiveChip] = useState(null);

  const [tiers, setTiers] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  });

  const [pool, setPool] = useState([
    { id: "chip1", img: "/img/pringles.png", name: "Pringles" },
    { id: "chip2", img: "/img/doritos.png", name: "Doritos" },
    { id: "chip3", img: "/img/lays.png", name: "Lays" },
    { id: "chip4", img: "/img/monster-munch.png", name: "Monster Munch" },
  ]);

  // ---- DRAG START -----------------------------------------------------

  const onDragStart = ({ active }) => {
    const id = active.id;

    const fromPool = pool.find((c) => c.id === id);
    if (fromPool) return setActiveChip(fromPool);

    for (const k of Object.keys(tiers)) {
      const c = tiers[k].find((x) => x.id === id);
      if (c) return setActiveChip(c);
    }
  };

  // ---- DRAG END -------------------------------------------------------

  const onDragEnd = ({ active, over }) => {
    setActiveChip(null);
    if (!over) return;

    const id = active.id;

    // 🔥 La vraie zone d’arrivée
    const destinationZone = over.data.current?.sortable?.containerId || over.id;

    if (!destinationZone) return;

    let movedChip = null;

    // retirer du pool
    if (pool.some((c) => c.id === id)) {
      movedChip = pool.find((c) => c.id === id);
      setPool((old) => old.filter((c) => c.id !== id));
    }

    // retirer d'une catégorie
    else {
      for (const key of Object.keys(tiers)) {
        if (tiers[key].some((c) => c.id === id)) {
          movedChip = tiers[key].find((c) => c.id === id);

          setTiers((old) => ({
            ...old,
            [key]: old[key].filter((c) => c.id !== id),
          }));
        }
      }
    }

    if (!movedChip) return;

    // déposer dans une catégorie
    if (tiers[destinationZone]) {
      setTiers((old) => ({
        ...old,
        [destinationZone]: [...old[destinationZone], movedChip],
      }));
    }

    // déposer dans le pool
    if (destinationZone === "pool") {
      setPool((old) => [...old, movedChip]);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <nav className="text-center">
        <Link to="/">Accueil</Link>
      </nav>
      <h1 className="title">Tier List</h1>

      <div className="tier-container">
        {Object.keys(tiers).map((tierKey) => (
          <div key={tierKey} className="tier-row">
            <div className={`tier-label tier-${tierKey}`}>{tierKey}</div>

            {/* ❗ IMPORTANT : chaque category a son propre SortableContext AVEC SON PROPRE ID */}
            <SortableContext id={tierKey} items={tiers[tierKey]}>
              <Zone id={tierKey}>
                {tiers[tierKey].map((chip) => (
                  <Chip key={chip.id} chip={chip} />
                ))}
              </Zone>
            </SortableContext>
          </div>
        ))}
      </div>

      <h2 className="subtitle">Chips disponibles</h2>

      <SortableContext id="pool" items={pool}>
        <Zone id="pool">
          <div className="pool">
            {pool.map((chip) => (
              <Chip key={chip.id} chip={chip} />
            ))}
          </div>
        </Zone>
      </SortableContext>

      <DragOverlay>
        {activeChip ? (
          <div className="chip overlay">
            <img src={activeChip.img} alt={activeChip.name} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
