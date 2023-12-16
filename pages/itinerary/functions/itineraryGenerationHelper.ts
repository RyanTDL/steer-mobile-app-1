import { firestore } from "../../../firebaseConfig";
import { DocumentData, collection, getDocs, limit, query, where } from "firebase/firestore";
// Database tasks:
  // TODO: fetch filtered options from accommodation database
  // TODO: fetch filtered options from activity database
  // Logic tasks:
  // TODO: get timetable start and end timings
  // TODO: get no. of activities per day
  // AI tasks:
  // TODO: get duration and time of day for each activity from AI (morning, afternoon, evening)
  // TODO: get AI generated itinerary summary


export async function getAccommodationOption(maxTripBudget: number, tripInterests: string[]): Promise<DocumentData|undefined> {
    const accommodationsRef = collection(firestore, "accommodations");

    // Create collection queries
    const budgetQuery = query(accommodationsRef, where("price", "<=", maxTripBudget));
    const interestQuery = query(accommodationsRef, where("accommodationTags", "array-contains-any", tripInterests));

    // Fetch documents from both queries
    const budgetDocs = await getDocs(budgetQuery);
    const interestDocs = await getDocs(interestQuery);

    // Convert to arrays of documents
    const budgetDocsArray = budgetDocs.docs.map(doc => doc.data());
    const interestDocsArray = interestDocs.docs.map(doc => doc.data());

    // Find intersection
    const commonDocs = budgetDocsArray.filter(doc => interestDocsArray.includes(doc));

    // Return random document from commonDocs
    if (commonDocs.length !== 0) {
        const randomIndex = Math.floor(Math.random() * commonDocs.length);
        return commonDocs[randomIndex];
    } else {
        if (budgetDocsArray.length !== 0) {
            const randomIndex = Math.floor(Math.random() * budgetDocsArray.length);
            return budgetDocsArray[randomIndex];
        } else {
            return undefined;
        }
    }
    }

export async function getExperiencesOptions(maxTripBudget: number, tripInterests: string[]): Promise<DocumentData[]|undefined> {
    const activitiesRef = collection(firestore, "experiences");

    // Create collection queries
    const budgetQuery = query(activitiesRef, where("price", "<=", maxTripBudget), limit(100));
    const interestQuery = query(activitiesRef, where("experienceTags", "array-contains-any", tripInterests), limit(100));

    // Fetch documents from both queries
    const budgetDocs = await getDocs(budgetQuery);
    const interestDocs = await getDocs(interestQuery);

    // Convert to arrays of documents
    const budgetDocsArray = budgetDocs.docs.map(doc => doc.data());
    const interestDocsArray = interestDocs.docs.map(doc => doc.data());

    // Find intersection
    const commonDocs = budgetDocsArray.filter(doc => interestDocsArray.includes(doc));

    // Return random document from commonDocs
    if (commonDocs.length !== 0) {
        return commonDocs;
    } else {
        if (budgetDocsArray.length !== 0) {
            return budgetDocsArray;
        } else {
            return undefined;
        }
    }
}