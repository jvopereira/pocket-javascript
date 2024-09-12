import dayjs from "dayjs";
import { client, db } from ".";
import { goalCompletions, goals } from "./schema";

async function seed() {
	await db.delete(goalCompletions);
	await db.delete(goals);

	const goalsInsertResult = await db
		.insert(goals)
		.values([
			{
				title: "Wake up early",
				desiredWeeklyFrequency: 5,
			},
			{
				title: "Working out",
				desiredWeeklyFrequency: 3,
			},
			{
				title: "Meditate",
				desiredWeeklyFrequency: 1,
			},
		])
		.returning();

	const startOfWeek = dayjs().startOf("week");

	await db.insert(goalCompletions).values([
		{
			goalId: goalsInsertResult[0].id,
			createdAt: startOfWeek.toDate(),
		},
		{
			goalId: goalsInsertResult[1].id,
			createdAt: startOfWeek.add(1, "day").toDate(),
		},
	]);
}

seed().finally(() => {
	client.end();
});
