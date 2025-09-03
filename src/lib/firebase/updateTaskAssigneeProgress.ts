import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { getCurrentUser } from "./getCurrentUser";

interface UpdatedFields {
  status?: "completed" | "not_started" | "in_progress";
  approveStatus?: "approved" | "rejected" | "not_sent";
  approvedBy?: string;
}

interface Assignee {
  uid: string;
  name?: string;
  status?: "completed" | "not_started" | "in_progress";
  approveStatus?: "approved" | "rejected" | "not_sent";
  approvedBy?: string;
}

export const updateAssigneeProgress = async (
  projectId: string,
  categoryId: string,
  taskId: string,
  updatedFields: UpdatedFields
) => {
  try {
    if (!taskId || !projectId || !categoryId) {
      console.error("❌ Missing required identifiers");
      return;
    }

    const taskRef = doc(db, "projects", projectId, "category", categoryId, "tasks", taskId);
    const snapshot = await getDoc(taskRef);

    if (!snapshot.exists()) {
      console.warn("⚠️ Task does not exist:", taskId);
      return;
    }

    const task = snapshot.data();
    const assignees: Assignee[] = (task.assignees as Assignee[]) || [];

    const currentIndex = task.currentAssigneeIndex;

    if (currentIndex === undefined || currentIndex >= assignees.length) {
      console.error("❌ Invalid currentAssigneeIndex");
      return;
    }

    let approvedBy = updatedFields.approvedBy;
    if (!approvedBy) {
      const user = await getCurrentUser();
      approvedBy = user?.uid || "Unknown";
    }

    // Merge the update into the current assignee
    assignees[task.currentAssigneeIndex] = {
      ...assignees[task.currentAssigneeIndex],
      ...updatedFields,
      approvedBy,
    };

    let currentAssignee: Assignee | null = assignees[task.currentAssigneeIndex];
    let nextIndex;

    const { approveStatus } = currentAssignee;

    if (approveStatus === "approved") {
      currentAssignee.status = "completed";
      nextIndex = task.currentAssigneeIndex + 1;
      if (nextIndex < assignees.length) {
        assignees[nextIndex].status = "in_progress";
        currentAssignee = assignees[nextIndex];
      } else {
        currentAssignee = null;
      }
    }

    await updateDoc(taskRef, {
      assignees,
      currentAssignee,
      updatedAt: new Date(),
      currentAssigneeIndex: nextIndex,
    });

  } catch (err) {
    console.error("❌ Error updating assignee progress:", err);
  }
};
