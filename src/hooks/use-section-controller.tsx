// hooks/useSectionsController.ts
import * as React from "react";
import { toast } from "sonner";
import { createSection } from "@/actions/section-actions";
import { SectionTag } from "@/generated/prisma";

export function useSectionsController(
  fieldValue: string[],
  fieldOnChange: (val: string[]) => void,
  sectionsList: SectionTag[]
) {
  const [newSectionName, setNewSectionName] = React.useState("");

  const handleCreateSection = async () => {
    const name = newSectionName.trim();
    if (!name) return;

    // Check if section already exists locally
    const exists = sectionsList.some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      toast.error("Section already exists!");
      return;
    }

    try {
      const section = await createSection(name); // server action
      sectionsList.push(section); // add to local list
      fieldOnChange([...fieldValue, section.id]); // select newly created
      setNewSectionName("");
      toast.success(`Section "${section.name}" created!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create section";
      toast.error(message);
    }
  };

  return { newSectionName, setNewSectionName, handleCreateSection };
}
